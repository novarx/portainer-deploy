import {expect, test} from '@oclif/test';
import {NockScope} from 'fancy-test/lib/types';

describe('DeployStack', () => {

    const BASE_URL = 'http://lorem.com/api';
    const JWT_TOKEN = 'kwbutxdu';

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
            .reply(200, {jwt: JWT_TOKEN});

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
        .matchHeader('Authorization', (value: string) => value === `Bearer ${JWT_TOKEN}`)
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
                'File: "test/commands/stack/docker-compose.empty.yml" is empty'
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
                'File: "iAmNotARealFolder/docker-compose.NOPE.yaml" not found'
            );
        });

    test.stderr().stdout()
        .command([
            'stack',
            ...validArguments
        ])
        .exit(1)
        .it('throw on non existing default compose-file', ctx => {
            expect(ctx.stderr).to.contain('File: "docker-compose.yml" not found');
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
        ])
        .it('successful deployment', ctx => {
            expect(ctx.stdout).to.contain('portainer deployment successful');
            expect(ctx.stdout).to.not.contain(JWT_TOKEN);
            const cleanStackFileContent = deploymentReq.stackFileContent.replaceAll('\r\n', `\n`);
            expect(cleanStackFileContent).to.eq("version: '3'\nservices:\n  app:\n    image: nginx\n");
            expect(deploymentReq.prune).to.be.true;
            expect(deploymentReq.env).to.deep.eq([]);
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
