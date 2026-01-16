import jonFetch from "./json-fetch";
import clearFolder from "./clear-folder";
import fetchWithBearerToken from "./fetch-with-bearer-token";

export const commands = {
  jsonFetch: jonFetch,
  clearFolder: clearFolder,
  fetchWithBearerToken: fetchWithBearerToken,
} as const;
