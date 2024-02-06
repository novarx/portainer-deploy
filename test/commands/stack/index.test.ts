import {expect, test} from '@oclif/test';
import {NockScope} from 'fancy-test/lib/types';

describe('DeployStack', () => {

    const BASE_URL = 'http://lorem.com/api';

    const validArguments = [
        '--endpoint=55',
        '--stack=44',
        '--url=http://lorem.com',
        '--password=abc',
        '--username=me'
    ];

    const authRequest = (api: NockScope) => api
        .persist()
        .post('/auth', captureAuthBody)
        .reply(200, {jwt: 'kwbutxdu'});

    const captureDeploymentBody = (body: any) => {
        deploymentReq = body;
        return true;
    };

    const captureAuthBody = (body: any) => {
        authReq = body;
        return true;
    };

    const deploymentRequest = (api: NockScope) => api
        .put('/stacks/44', captureDeploymentBody)
        .matchHeader('Authorization', (value: string) => value === 'Bearer kwbutxdu')
        .query({'endpointId': 55})
        .reply(200, {});

    let deploymentReq: any | null;
    let authReq: any | null;

    beforeEach(() => {
        deploymentReq = null;
        authReq = null;
    });

    test.stderr().stdout()
        .command([
            'stack',
            'test/commands/stack/docker-compose.empty.yml',
            ...validArguments
        ])
        .exit(1)
        .it('throw on empty compose-file', ctx => {
            expect(ctx.stderr).to.contain(
                'Compose File: "test/commands/stack/docker-compose.empty.yml" is empty or not present'
            );
        });

    test.stderr().stdout()
        .command([
            'stack',
            'iAmNotARealFolder/docker-compose.NOPE.yaml',
            ...validArguments
        ])
        .exit(1)
        .it('throw on non existing compose-file', ctx => {
            expect(ctx.stderr).to.contain(
                'Compose File: "iAmNotARealFolder/docker-compose.NOPE.yaml" is empty or not present'
            );
        });

    test.stderr().stdout()
        .command([
            'stack',
            ...validArguments
        ])
        .exit(1)
        .it('throw on non existing default compose-file', ctx => {
            expect(ctx.stderr).to.contain('Compose File: "docker-compose.yml" is empty or not present');
        });

    test.stderr().stdout()
        .env({
            'VAR_1': 'MFu51GC'
        })
        .nock(BASE_URL, authRequest)
        .nock(BASE_URL, deploymentRequest)
        .command([
            'stack',
            'test/commands/stack/docker-compose.yaml',
            ...validArguments,
            '--env_link=VAR_1,VAR_NOT_DEFINED'
        ])
        .it('with env_link flag', () => {
            expect(deploymentReq.env).to.deep.eq([
                {
                    'name': 'VAR_1',
                    'value': 'MFu51GC'
                },
                {
                    'name': 'VAR_NOT_DEFINED',
                    'value': ''
                }
            ]);
        });

    test.stderr().stdout()
        .nock(BASE_URL, authRequest)
        .nock(BASE_URL, deploymentRequest)
        .command([
            'stack',
            'test/commands/stack/docker-compose.yaml',
            ...validArguments,
            '--envs=[{"name": "VAR_2", "value": "Ff9RlhUisQ"}]'
        ])
        .it('with envs array flag', () => {
            expect(deploymentReq.env).to.deep.eq([
                {
                    'name': 'VAR_2',
                    'value': 'Ff9RlhUisQ'
                }
            ]);
        });

    test.stderr().stdout()
        .nock(BASE_URL, authRequest)
        .nock(BASE_URL, deploymentRequest)
        .command([
            'stack',
            'test/commands/stack/docker-compose.yaml',
            ...validArguments,
        ])
        .it('successful deployment', ctx => {
            expect(ctx.stdout).to.contain('portainer deployment successful');
            const cleanStackFileContent = deploymentReq.stackFileContent.replaceAll('\r\n', `\n`);
            expect(cleanStackFileContent).to.eq("version: '3'\nservices:\n  app:\n    image: nginx\n");
            expect(deploymentReq.prune).to.be.true;
            expect(deploymentReq.env).to.deep.eq([]);
        });

    test.stderr().stdout()
        .nock(BASE_URL, authRequest)
        .command([
            'stack',
            'test/commands/stack/docker-compose.yaml',
            ...validArguments
        ])
        .exit(1)
        .it('handles http error', ctx => {
            expect(ctx.stderr).to.contain('portainer deployment error:');
        });

    test.stderr().stdout()
        .nock(BASE_URL, authRequest)
        .nock(BASE_URL, deploymentRequest)
        .command([
            'stack',
            'test/commands/stack/docker-compose.yaml',
            ...validArguments,
        ])
        .it('authenticates', () => {
            expect(authReq).to.deep.eq({
                "password": "abc",
                "username": "me",
            });
        });
});
