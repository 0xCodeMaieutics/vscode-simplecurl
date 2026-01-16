import * as vscode from "vscode";
import {
  accessAsync,
  execAsync,
  mkdirAsync,
  readdirAsync,
  writeFileAsync,
} from "../promisify";
import { join } from "path";
import { PROJECT_NAME } from "../constants";

export default async () => {
  try {
    const url = await vscode.window.showInputBox({
      prompt: "Enter URL to curl",
      placeHolder: "https://example.com",
    });

    if (!url) {
      vscode.window.showWarningMessage("No URL provided");
      return;
    }

    const bearerToken = await vscode.window.showInputBox({
      prompt: "Enter Bearer Token",
      placeHolder: "your-bearer-token",
      password: true,
    });

    if (!bearerToken) {
      vscode.window.showWarningMessage("No Bearer Token provided");
      return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage("No workspace folder is open");
      return;
    }

    const basePath = workspaceFolder.uri.fsPath;
    const projectFolder = join(basePath, PROJECT_NAME);

    try {
      await accessAsync(projectFolder);
    } catch {
      await mkdirAsync(projectFolder, { recursive: true });
    }

    const files = await readdirAsync(projectFolder);

    let prefixNumber = 1;
    if (files.length > 0) {
      const dataFiles = files.filter((file) => {
        const match = file.match(/^(\d+)_data\.json$/);
        return match !== null;
      });
      if (dataFiles.length > 0) {
        const numbers = dataFiles
          .map((file) => {
            const match = file.match(/^(\d+)_data\.json$/);
            return match ? parseInt(match[1], 10) : 0;
          })
          .filter((num) => num > 0);
        if (numbers.length > 0) {
          prefixNumber = Math.max(...numbers) + 1;
        }
      }
    }

    const jsonOutput = await execAsync(
      `curl -H "Authorization: Bearer ${bearerToken}" ${url}`
    );
    const outputPath = join(projectFolder, `${prefixNumber}_data.json`);
    await writeFileAsync(outputPath, jsonOutput.stdout);
    await execAsync(`open -a "Cursor.app" ${outputPath}`);
    vscode.window.showInformationMessage(
      `Successfully created ${prefixNumber}_data.json`
    );
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(
      "fetchWithBearerToken" + ": " + "Error occurred, see logs."
    );
  }
};
