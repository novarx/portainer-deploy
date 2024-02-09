import {Config} from '@oclif/core/lib/config';
import {Options} from '@oclif/core/lib/interfaces/plugin';
import {expect} from '@oclif/test';

import DeployStack from '../../../src/commands/stack';
import {Env, PortainerService, PortainerUser} from '../../../src/services/portainer.service';
import {LogCleanerService} from '../../../src/services/log-cleaner.service';

describe('DeployStack', () => {
    let config: Config;

    const validArguments = [
        '--endpoint=55',
        '--stack=44',
        '--url=http://lorem.com',
        '--password=abc',
        '--username=me'
    ];

    const mockService = {
        async login(url: string, user: PortainerUser): Promise<boolean> {
            return true;
        },
        deploy(url: string, stackId: number, composeContent: string, endpointId: number, envs: Env[]): Promise<any> {
            return new Promise<any>(resolve => {
                resolve({});
            });
        }
    } as PortainerService;

    const mockLogService = {

    } as LogCleanerService;

    beforeEach(() => {
        config = new Config({} as Options);
    });

    it('should create', () => {
        const sut = new DeployStack([], config);
        expect(sut).not.to.be.null;
    });

    it('should run', async () => {
        const sut = new DeployStack([
            'test/commands/stack/docker-compose.yaml',
            ...validArguments
        ], config);

        sut.service = mockService;
        sut.logCleaner = mockLogService;

        await sut.run().then(result => {
            expect(result).not.to.be.null;
        });
    });
});
