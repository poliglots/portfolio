import { writeFileSync } from "node:fs";
import { TIME_JSON_FILE } from "../config/paths.ts";

/**
 * Write the current UTC timestamp to the time JSON file.
 */
export function writeTime(): void {
  try {
    writeFileSync(TIME_JSON_FILE, `{"time":"${new Date()}"}`);
  } catch {
    console.log("error in writing time");
  }
}

/**
 * Write any data as JSON to the specified file path.
 */
export function writeJson<T>(data: T, filePath: string): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}
