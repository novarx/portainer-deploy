import * as Redactyl from 'redactyl.js';
import {RedactData} from 'redactyl.js';

export class LogCleanerService {
    private static readonly REPLACEMENT = '[REDACTED]';

    private sensitiveValues: any[] = [];

    public clean<T>(value: T): T {
        const redactyl = new Redactyl({
            // Required
            'properties': ['apiKey', 'password', 'Authorization'],
            replacer: (key: string, value: RedactData) => this.replaceSensitiveValues(value),

            // Optional
            'text': LogCleanerService.REPLACEMENT,
        });

        return redactyl.redact(value as RedactData) as T;
    }

    public sensitiveValue<T>(sensitiveValue: T): T {
        this.sensitiveValues.push(sensitiveValue);
        return sensitiveValue;
    }

    private isSensitive(value: any) {
        const matcher: (sensitiveValue: any) => boolean =
            value?.includes == null
                ? v => value === v
                : v => value.includes(v);

        return this.sensitiveValues.some(v => matcher(v));
    }

    private replaceSensitiveValues(value: any): any {
        return this.isSensitive(value) ? LogCleanerService.REPLACEMENT : value;
    }
}
