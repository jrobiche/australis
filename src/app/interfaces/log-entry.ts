export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
  PANIC = 6,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  scope: string;
  timestamp: number;
}
