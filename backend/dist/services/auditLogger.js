"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogger = void 0;
const REDACTED = '[REDACTED]';
const SENSITIVE_KEY = /password|token|secret|authorization|cookie|credential|email|phone|address/i;
const sanitizeValue = (value, key) => {
    if (key && SENSITIVE_KEY.test(key))
        return REDACTED;
    if (typeof value === 'string')
        return value.replace(/\bBearer\s+\S+/gi, REDACTED);
    if (Array.isArray(value))
        return value.map((item) => sanitizeValue(item));
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [
            childKey,
            sanitizeValue(childValue, childKey),
        ]));
    }
    return value;
};
class AuditLogger {
    static events = [];
    static log(event) {
        const fullEvent = {
            ...event,
            metadata: event.metadata
                ? sanitizeValue(event.metadata)
                : undefined,
            timestamp: new Date().toISOString(),
        };
        this.events.unshift(fullEvent);
        if (this.events.length > 100)
            this.events.pop();
        return fullEvent;
    }
    static getRecentEvents(limit = 20) {
        const safeLimit = Number.isInteger(limit) ? Math.max(0, Math.min(limit, 100)) : 20;
        return this.events.slice(0, safeLimit);
    }
}
exports.AuditLogger = AuditLogger;
