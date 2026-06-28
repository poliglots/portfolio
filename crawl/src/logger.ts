import winston from "winston";
import { NEWS_TEXT_FILE, JOBS_TEXT_FILE } from "./config.ts";

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

// Combined logger: log.info() writes to both files
export const logger = {
  info: (meta: unknown, payload: unknown) => {
    // Detect if payload is a job (has 'id' and 'source') or news (has 'link' and 'headline')
    const entry = { meta, payload };
    const isJob = payload && typeof payload === "object" && "id" in (payload as object);
    if (isJob) {
      jobsLogger.info("", payload);
    } else {
      newsLogger.info("", payload);
    }
  },
};
