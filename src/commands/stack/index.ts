import {Args, Command, Flags} from '@oclif/core';

import {EnvVariablesMapper} from '../../services/env-variables-mapper';
import {FileReader} from '../../services/file-reader';
import {LogCleanerService} from '../../services/log-cleaner.service';
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

    private readonly logCleaner = new LogCleanerService();

    async run(): Promise<void> {
        const {args, flags} = await this.parse(DeployStack);
        try {
            const composeFile = FileReader.readNonEmptyContent(args.file);
            const envs: Env[] = EnvVariablesMapper.getVariables(flags.env_link, flags.envs);

            const service = new PortainerService(flags.url);
            await service.login({
                username: flags.username,
                password: flags.password
            });
            this.logCleaner.sensitiveValue(service.token);
            return service.deploy(flags.stack, composeFile!, flags.endpoint, envs)
                .then(r => {
                    this.log('portainer deployment successful', this.logCleaner.clean(r));
                })
                .catch(error => this.fail(`portainer deployment error:`, error));
        } catch (error: any) {
            this.fail(error.message);
        }
    }

    private fail(message: string, error: any = null) {
        const formattedError = error == null ? '' : '\n' + JSON.stringify(this.logCleaner.clean(error), null, 2);
        this.logToStderr(`${message}${formattedError}`);
        this.exit(1);
    }
}
