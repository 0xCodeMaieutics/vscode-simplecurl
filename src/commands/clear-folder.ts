import * as vscode from "vscode";
import { accessAsync, readdirAsync, unlinkAsync } from "../promisify";
import { join } from "path";
import { PROJECT_NAME } from "../constants";

export default async () => {
  try {
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
      vscode.window.showInformationMessage(
        `Folder ${PROJECT_NAME} does not exist or is already empty`
      );
      return;
    }

    const files = await readdirAsync(projectFolder);

    if (files.length === 0) {
      vscode.window.showInformationMessage(
        `Folder ${PROJECT_NAME} is already empty`
      );
      return;
    }

    // Delete all files in the folder
    await Promise.all(
      files.map((file) => unlinkAsync(join(projectFolder, file)))
    );

    vscode.window.showInformationMessage(
      `Successfully cleared ${PROJECT_NAME} folder (${files.length} file${
        files.length === 1 ? "" : "s"
      } deleted)`
    );
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(
      "clearFolder" + ": " + "Error occurred, see logs."
    );
  }
};
