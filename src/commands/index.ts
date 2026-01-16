import jonFetch from "./json-fetch";
import clearFolder from "./clear-folder";

export const commands = {
  jsonFetch: jonFetch,
  clearFolder: clearFolder,
} as const;
