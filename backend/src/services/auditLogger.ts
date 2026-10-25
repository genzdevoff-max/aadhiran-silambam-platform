export interface AuditEvent {
  actorId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export type AuditEventInput = Omit<AuditEvent, 'timestamp'>;

const REDACTED = '[REDACTED]';
const SENSITIVE_KEY = /password|token|secret|authorization|cookie|credential|email|phone|address/i;

const sanitizeValue = (value: unknown, key?: string): unknown => {
  if (key && SENSITIVE_KEY.test(key)) return REDACTED;
  if (typeof value === 'string') return value.replace(/\bBearer\s+\S+/gi, REDACTED);
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        sanitizeValue(childValue, childKey),
      ])
    );
  }
  return value;
};

export class AuditLogger {
  private static readonly events: AuditEvent[] = [];

  static log(event: AuditEventInput): AuditEvent {
    const fullEvent: AuditEvent = {
      ...event,
      metadata: event.metadata
        ? sanitizeValue(event.metadata) as Record<string, unknown>
        : undefined,
      timestamp: new Date().toISOString(),
    };

    this.events.unshift(fullEvent);
    if (this.events.length > 100) this.events.pop();
    return fullEvent;
  }

  static getRecentEvents(limit = 20): AuditEvent[] {
    const safeLimit = Number.isInteger(limit) ? Math.max(0, Math.min(limit, 100)) : 20;
    return this.events.slice(0, safeLimit);
  }
}
