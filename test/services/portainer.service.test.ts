import {expect, test} from '@oclif/test';

import {Env, PortainerService, PortainerUser} from '../../src/services/portainer.service';

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

    const user: PortainerUser = {
        username: 'rPciNc7S',
        password: '1jEEmcfSIP'
    };

    beforeEach(() => {
        sut = new PortainerService();
    });

    const verifyAuthBody = (body: any): boolean =>
        JSON.stringify(body).indexOf(user.password) > 0 &&
        JSON.stringify(body).indexOf(user.username) > 0;

    test
        .nock('http://lorem.com/api', api => api
            .post('/auth', body => verifyAuthBody(body))
            .reply(200, {jwt: 'ZPUjwQXPsVJ'})
        )
        .it('should do authentication', async () => {
            const response: any = await sut.login(expected.url, user);
            expect(response).is.eq(true);
            expect(sut.token).is.eq('ZPUjwQXPsVJ');
        });
});
