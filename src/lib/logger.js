/**
 * Lightweight client logger — no secrets, no PII dumps.
 * In production, only warn/error are emitted.
 */
import { env } from '@/config/env';

const redact = (value) => {
  if (value == null) return value;
  if (typeof value === 'string') {
    if (/Bearer\s+\S+/i.test(value)) return value.replace(/Bearer\s+\S+/gi, 'Bearer [redacted]');
    if (/pk_(test|live)_[A-Za-z0-9]+/.test(value)) return value.replace(/pk_(test|live)_[A-Za-z0-9]+/g, 'pk_[redacted]');
    return value;
  }
  return value;
};

function emit(level, args) {
  const safe = args.map(redact);
  // eslint-disable-next-line no-console
  console[level](...safe);
}

export const logger = {
  debug(...args) {
    if (env.isDev) emit('debug', args);
  },
  info(...args) {
    if (env.isDev) emit('info', args);
  },
  warn(...args) {
    emit('warn', args);
  },
  error(...args) {
    emit('error', args);
  }
};
