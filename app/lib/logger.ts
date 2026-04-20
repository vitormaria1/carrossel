/**
 * Logger Estruturado para o Projeto
 * Centraliza logging com níveis e contexto
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private context: LogContext = {};

  setContext(context: LogContext) {
    this.context = { ...context };
  }

  private formatLog(level: LogLevel, message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(this.context).length > 0
      ? ` [${JSON.stringify(this.context)}]`
      : '';

    const baseLog = `[${timestamp}] ${level}: ${message}${contextStr}`;

    if (data) {
      return `${baseLog} | ${JSON.stringify(data)}`;
    }

    return baseLog;
  }

  debug(message: string, data?: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatLog(LogLevel.DEBUG, message, data));
    }
  }

  info(message: string, data?: unknown) {
    console.log(this.formatLog(LogLevel.INFO, message, data));
  }

  warn(message: string, data?: unknown) {
    console.warn(this.formatLog(LogLevel.WARN, message, data));
  }

  error(message: string, error?: unknown) {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        }
      : error;

    console.error(this.formatLog(LogLevel.ERROR, message, errorData));
  }
}

export const logger = new Logger();
