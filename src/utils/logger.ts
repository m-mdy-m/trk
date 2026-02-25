import winston from 'winston';
import path from 'path';
import os from 'os';

const LOG_FILE = path.join(os.homedir(), '.trk', 'trk.log');

export const logger = winston.createLogger({
  level: process.env.TRK_LOG_LEVEL ?? 'warn',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      filename: LOG_FILE,
      maxFiles: 7,
      options: { flags: 'a' },
    }),
  ],
});

if (process.env.TRK_VERBOSE === '1') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}