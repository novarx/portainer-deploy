import {expect, test} from '@oclif/test';
import {firstValueFrom} from 'rxjs';

import {Env, PortainerService} from '../../src/services/portainer.service';

describe('PortainerService', () => {

    let sut: PortainerService;

    const expected = {
        username: '4R9',
        password: '49Ml302P',
        url: 'http://lorem.com',
        envs: [{
            name: 'lorem',
            value: 'bacon'
        } as Env],
    };

    beforeEach(() => {
        sut = new PortainerService(expected.username, expected.password, expected.url);
    });

    test
        .nock('http://lorem.com/api', api => api
            .post('/auth')
            .reply(200, {jwt: 'bla'})
        )
        .nock('http://lorem.com/api', api => api
            .put('/stacks/77', assertCorrectBodyValues)
            .query({'endpointId': 88})
            .reply(200, {})
        )
        .it('should do authentication and deployment', async () => {
            const deployment = sut.deploy(77, 'fbjc2QZ0Qv', 88, expected.envs);

            const response = await firstValueFrom(deployment);

            expect(response)
                .to.have.property("status")
                .that.is.eq(200);
        });

    const assertCorrectBodyValues = (body: any): true => {
        expect(body.stackFileContent).to.eq('fbjc2QZ0Qv');
        expect(body.prune).to.be.true;
        expect(body.env).to.deep.eq([{
            name: 'lorem',
            value: 'bacon'
        } as Env]);
        return true;
    }
});
