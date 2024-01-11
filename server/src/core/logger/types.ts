import { LogEntry } from 'winston';

export type JsonObject = { [Key in string]?: any };

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export type LogObject = {
  level: LogLevel;
  data?: JsonObject;
  meta?: LoggerMeta;
  timestamp?: string;
} & LogEntry;

export interface LoggerMeta {
  lambdaName?: string;
}
