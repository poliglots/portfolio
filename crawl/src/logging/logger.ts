import winston from "winston";
import { NEWS_TEXT_FILE, JOBS_TEXT_FILE } from "../config/paths.ts";

// Separate loggers for news and jobs — each writes to its own file
export const newsLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: NEWS_TEXT_FILE,
      options: { flags: "w" },
    }),
  ],
});

export const jobsLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: JOBS_TEXT_FILE,
      options: { flags: "w" },
    }),
  ],
});
