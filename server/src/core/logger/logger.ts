import winston from 'winston';

import { JsonObject, LogLevel, LogObject, LoggerMeta } from './types';

export class Logger {
  private winstonLogger: winston.Logger;
  private meta: LoggerMeta;

  constructor() {
    this.createLogger();
  }

  private createWinstonFormat() {
    const { json, errors, timestamp } = winston.format;
    return winston.format.combine(timestamp(), errors({ stack: true }), json());
  }

  private createLogger() {
    const consoleTransport = new winston.transports.Console();

    this.winstonLogger = winston.createLogger({
      level: 'debug',
      exitOnError: false,
      format: this.createWinstonFormat(),
      transports: [consoleTransport],
      exceptionHandlers: [consoleTransport],
    });
  }

  private createLogObject(message: string, level: LogLevel, data?: JsonObject) {
    const obj: LogObject = { message: message, level: level, meta: this.meta, data: data };
    return obj;
  }

  public updateMeta(meta: Partial<LoggerMeta>) {
    if (!this.meta) {
      this.meta = {};
    }
    this.meta.lambdaName = meta.lambdaName || this.meta.lambdaName;
  }

  public log(log: LogObject) {
    this.winstonLogger.log(log);
  }

  public debug(message: string, data?: JsonObject) {
    const log = this.createLogObject(message, 'debug', data);
    this.winstonLogger.log(log);
  }

  public info(message: string, data?: JsonObject) {
    const log = this.createLogObject(message, 'info', data);
    this.winstonLogger.log(log);
  }

  public warn(message: string, data?: JsonObject) {
    const log = this.createLogObject(message, 'warn', data);
    this.winstonLogger.log(log);
  }

  public error(message: string, data?: JsonObject) {
    const log = this.createLogObject(message, 'error', data);
    this.winstonLogger.log(log);
  }
}
