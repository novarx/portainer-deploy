import {expect} from '@oclif/test';

import {LogCleanerService} from '../../src/services/log-cleaner.service';

describe('LogCleanerService', () => {

    let sut: LogCleanerService;
    let cleanObject: any;

    beforeEach(() => {
        sut = new LogCleanerService();
        cleanObject = {
            'lorem': 'ipsum',
            'myInt': 55,
            'inner': {
                'bacon': 'what?'
            }
        };
    });

    it('should not change non-sensitive data', () => {
        expect(sut.clean(cleanObject)).to.deep.eq(cleanObject);
    });

    it('should obfuscate sensitive string by value', () => {
        sut.sensitiveValue('tpaczimc8z');
        sut.sensitiveValue('6L42OWWI0O');

        const value = {
            ...cleanObject,
            'myRandomProperty': 'tpaczimc8z',
            'sholdNotBeLogged': 'Something else 6L42OWWI0O'
        };
        expect(sut.clean(value)).to.deep.eq({
            ...cleanObject,
            'myRandomProperty': '[REDACTED]',
            'sholdNotBeLogged': '[REDACTED]'
        });
    });

    it('should obfuscate potential sensitive properties', () => {
        const value = {
            ...cleanObject,
            'Authorization': 'Bearer UAQ4TAhR'
        };
        expect(sut.clean(value)).to.deep.eq({
            ...cleanObject,
            'Authorization': '[REDACTED]'
        });
    });

    it('should obfuscate', () => {
        const value = {
            'config': {
                'adapter': [
                    'xhr',
                    'http'
                ],
            },
        };
        expect(sut.clean(value)).to.deep.eq(value);
    });
});
