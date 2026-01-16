import { promisify } from "node:util";
import { exec } from "node:child_process";
import { writeFile, mkdir, readdir, access, unlink } from "node:fs";

export const execAsync = promisify(exec);
export const writeFileAsync = promisify(writeFile);
export const mkdirAsync = promisify(mkdir);
export const readdirAsync = promisify(readdir);
export const accessAsync = promisify(access);
export const unlinkAsync = promisify(unlink);
