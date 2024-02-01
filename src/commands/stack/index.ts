import {Args, Command, Flags} from '@oclif/core';
import * as fs from 'node:fs';
import {lastValueFrom} from 'rxjs';

import {Env, PortainerService} from '../../services/portainer.service';

export default class DeployStack extends Command {
    static args = {
        file: Args.string({
            default: 'docker-compose.yml',
            description: 'docker-compose file to deploy',
            name: 'file',
        }),
    };

    static description = 'Deploys Docker Compose Files to Portainer';

    static flags = {
        endpoint: Flags.integer({
            description: 'portainer endpoint id',
            env: 'PORTAINER_ENDPOINT',
            required: true
        }),
        // eslint-disable-next-line camelcase
        env_link: Flags.string({
            description: 'local variables to be sent to portainer stack, i.e.: "MY_ENV_VAR, MY_OTHER_ENV_VAR',
            env: 'PORTAINER_ENV_LINKS',
            exclusive: ['envs']
        }),
        envs: Flags.string({
            description: 'portainer env variables as json-array',
            env: 'PORTAINER_ENVS',
            exclusive: ['env_link']
        }),
        password: Flags.string({
            description: 'portainer password',
            env: 'PORTAINER_PASS',
            required: true
        }),
        stack: Flags.integer({
            description: 'portainer stack id',
            env: 'PORTAINER_STACK',
            required: true
        }),
        url: Flags.string({
            description: 'portainer base url i.e.: https://portainer.example.com',
            env: 'PORTAINER_URL',
            required: true
        }),
        username: Flags.string({
            description: 'portainer username',
            env: 'PORTAINER_USER',
            required: true
        }),
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(DeployStack);

        const composeFile = this.getFileContent(args.file);
        if (!composeFile) this.fail(`Compose File: "${args.file}" is empty or not present`);

        const envs: Env[] = flags.env_link
            ? this.localEnvToArray(flags.env_link)
            : this.envFlagsToArrayOrThrow(flags.envs);

        const service = new PortainerService(flags.username, flags.password, flags.url);
        return lastValueFrom(service.deploy(flags.stack, composeFile!, flags.endpoint, envs))
            .then(() => this.log('portainer deployment successful'))
            .catch(error => this.fail(`portainer deployment error: ${JSON.stringify(error, null, 2)}`));
    }

    private envFlagsToArrayOrThrow(envsAsString: string | undefined): Env[] {
        if (envsAsString === null || envsAsString === undefined) return [];

        const envs: Env[] = JSON.parse(envsAsString);

        if (!Array.isArray(envs)) this.fail('PORTAINER_ENVS is not an array');

        const hasAnyNonEnvEntries = envs.some((env: Env) => env.name == null && env.value == null);
        if (hasAnyNonEnvEntries) this.fail('PORTAINER_ENVS must be array like [{"name": string, "value": string');

        return envs;
    }

    private fail(message: string) {
        this.logToStderr(message);
        this.exit(1);
    }

    private getFileContent(filename: string): null | string {
        try {
            return fs.readFileSync(filename).toString();
        } catch (error) {
            if (error instanceof Error) {
                this.logToStderr(error.message);
            }

            return null;
        }
    }

    private localEnvToArray(envLinks: string): Env[] {
        return envLinks.split(',')
            .map(envName => envName.trim())
            .map(envName => ({
                name: envName,
                value: process.env[envName] ?? ''
            } as Env));
    }
}
