import {expect, test} from '@oclif/test';
import {firstValueFrom} from 'rxjs';

import {PortainerService} from '../../src/services/portainer.service';

describe('PortainerService', () => {
    test
        .nock('http://lorem.com/api', api => api
            .post('/auth')
            .reply(200, {jwt: 'bla'})
        )
        .nock('http://lorem.com/api', api => api
            .put('/stacks/77')
            .query({'endpointId': 88})
            .reply(200, {})
        )
        .it('should do authentication and deployment', async () => {
            const username = '4R9';
            const password = '49Ml302P';
            const url = 'http://lorem.com';

            const sut = new PortainerService(username, password, url);

            const result = await firstValueFrom(sut.deploy(77, '', 88, []));
            expect(result)
                .to.have.property("status")
                .that.is.eq(200);
        });
});
