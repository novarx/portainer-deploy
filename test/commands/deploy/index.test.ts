import {expect, test} from '@oclif/test';

describe('Deploy', () => {

    const validArguments = [
        '--endpoint=55',
        '--stack=44',
        '--url=http://lorem.com',
        '--password=abc',
        '--username=me'
    ];

    test.stderr().stdout()
        .command([
            'deploy',
            'test/commands/deploy/docker-compose.empty.yml',
            ...validArguments
        ])
        .exit(1)
        .it('throw on empty compose-file', ctx => {
            expect(ctx.stderr).to.contain(
                'Compose File: "test/commands/deploy/docker-compose.empty.yml" is empty or not present'
            );
        });

    test.stderr().stdout()
        .command([
            'deploy',
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
            'deploy',
            ...validArguments
        ])
        .exit(1)
        .it('throw on non existing default compose-file', ctx => {
            expect(ctx.stderr).to.contain('Compose File: "docker-compose.yml" is empty or not present');
        });

    test.stderr().stdout()
        .nock('http://lorem.com/api', api => api
            .post('/auth')
            .reply(200, {jwt: 'bla'})
        )
        .nock('http://lorem.com/api', api => api
            .put('/stacks/44')
            .query({'endpointId': 55})
            .reply(200, {})
        )
        .command([
            'deploy',
            'test/commands/deploy/docker-compose.yaml',
            ...validArguments
        ])
        .it('shows cli version', ctx => {
            expect(ctx.stdout).to.contain('portainer deployment successful');
        });

    test.stderr().stdout()
        .nock('http://lorem.com/api', api => api
            .post('/auth')
            .reply(200, {jwt: 'my-auth-jwt'})
        )
        .command([
            'deploy',
            'test/commands/deploy/docker-compose.yaml',
            '--endpoint=55',
            '--stack=44',
            '--url=http://lorem.com',
            '--password=abc',
            '--username=me',
        ])
        .exit(1)
        .it('handles http error', ctx => {
            expect(ctx.stderr).to.contain('portainer deployment error:');
        });
});
