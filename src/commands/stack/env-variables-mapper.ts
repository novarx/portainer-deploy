import {Env} from '../../services/portainer.service';

class EnvVariablesError extends Error {
}

export class EnvVariablesMapper {
    static getVariables(envLink: string | undefined, envs: string | undefined): Env[] {
        return envLink
            ? this.localEnvToArray(envLink)
            : this.envFlagsToArrayOrThrow(envs);
    }


    private static envFlagsToArrayOrThrow(envsAsString: string | undefined): Env[] {
        if (envsAsString === null || envsAsString === undefined) return [];

        const envs: Env[] = JSON.parse(envsAsString);

        if (!Array.isArray(envs)) this.fail('PORTAINER_ENVS is not an array');

        const hasAnyNonEnvEntries = envs.some((env: Env) => env.name == null && env.value == null);
        if (hasAnyNonEnvEntries) this.fail('PORTAINER_ENVS must be array like [{"name": string, "value": string');

        return envs;
    }

    private static fail(message: string) {
        throw new EnvVariablesError(message);
    }

    private static localEnvToArray(envLinks: string): Env[] {
        return envLinks.split(',')
            .map(envName => envName.trim())
            .map(envName => ({
                name: envName,
                value: process.env[envName] ?? ''
            } as Env));
    }
}
