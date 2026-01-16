import * as vscode from "vscode";
import { commands } from "./commands";
import { PROJECT_NAME } from "./constants";

export function activate(context: vscode.ExtensionContext) {
  const disposable1 = vscode.commands.registerCommand(
    `${PROJECT_NAME}.jsonFetch`,
    commands.jsonFetch
  );
  context.subscriptions.push(disposable1);

  const disposable2 = vscode.commands.registerCommand(
    `${PROJECT_NAME}.clearFolder`,
    commands.clearFolder
  );
  context.subscriptions.push(disposable2);
}

export function deactivate() {}
