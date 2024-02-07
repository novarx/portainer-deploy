import * as fs from 'node:fs';

export const FileReader = {
    readContent(filename: string): string {
        try {
            return fs.readFileSync(filename).toString();
        } catch {
            throw new FileNotFound(filename);
        }
    },

    readNonEmptyContent(filename: string): string {
        const content = this.readContent(filename);
        if (!content) throw new FileEmptyError(filename);
        return content;
    }
};

export class FileNotFound extends Error {
    constructor(filePath: string) {
        super(`File: "${filePath}" not found`);
    }
}

export class FileEmptyError extends Error {
    constructor(filePath: string) {
        super(`File: "${filePath}" is empty`);
    }
}
