import {expect} from '@oclif/test';

import {FileEmptyError, FileNotFound, FileReader} from '../../src/services/file-reader';

describe('FileReader', () => {
    it('should read file', () => {
        const result = FileReader.readContent('test/commands/stack/docker-compose.yaml');
        expect(result).to.eq('' +
            'version: \'3\'\n' +
            'services:\n' +
            '  app:\n' +
            '    image: nginx\n'
        );
    });

    it('throws on non existing file', () => {
        const sut = () => FileReader.readContent('iAmNotARealFolder/docker-compose.NOPE.yaml');
        expect(sut).to.throw(FileNotFound);
        expect(sut).to.throw('File: "iAmNotARealFolder/docker-compose.NOPE.yaml" not found');
    });

    it('throws on empty', () => {
        const sut = () => FileReader.readNonEmptyContent('test/commands/stack/docker-compose.empty.yml');
        expect(sut).to.throw(FileEmptyError);
        expect(sut).to.throw('File: "test/commands/stack/docker-compose.empty.yml" is empty');
    });
});
