import {expect} from '@oclif/test';

import {EnvVariablesMapper} from '../../src/services/env-variables-mapper';

describe('EnvVariablesMapper', () => {
    it('should be empty array if no envs given', () => {
        const result = EnvVariablesMapper.getVariables(undefined);
        expect(result).to.deep.eq([]);
    });

    it('gets nonexistent env variable', () => {
        delete process.env.MY_UNDEFINED_VAR;

        const result = EnvVariablesMapper.getVariables('MY_UNDEFINED_VAR');
        expect(result).to.deep.eq([{
            name: 'MY_UNDEFINED_VAR',
            value: ''
        }]);
    });

    it('gets env variables', () => {
        process.env.MY_VAR_A = 'DvqH4f3';
        process.env.MY_VAR_B = 'uxFjOih2eWF';

        const result = EnvVariablesMapper.getVariables('MY_VAR_A, MY_VAR_B, NOT_DEFINED');

        expect(result).to.deep.eq([
            {
                name: 'MY_VAR_A',
                value: 'DvqH4f3'
            },
            {
                name: 'MY_VAR_B',
                value: 'uxFjOih2eWF'
            },
            {
                name: 'NOT_DEFINED',
                value: ''
            }
        ]);
    });
});
