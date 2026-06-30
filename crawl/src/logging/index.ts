import { newsLogger, jobsLogger } from "./logger.ts";

export { newsLogger, jobsLogger } from "./logger.ts";

/**
 * Combined logger: routes entries to the appropriate file based on type.
 * Jobs have an 'id' field; news have a 'link' field.
 */
export const logger = {
  info: (meta: unknown, payload: unknown) => {
    const isJob = payload && typeof payload === "object" && "id" in (payload as object);
    if (isJob) {
      jobsLogger.info("", payload);
    } else {
      newsLogger.info("", payload);
    }
  },
};
