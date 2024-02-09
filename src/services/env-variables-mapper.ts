import {Env} from './portainer.service';

export class EnvVariablesMapper {

    public static getVariables(envLink: string | undefined): Env[] {
        if (envLink == null) return [];
        return envLink.split(',')
            .map(envName => envName.trim())
            .map(envName => ({
                name: envName,
                value: process.env[envName] ?? ''
            } as Env));
    }
}
