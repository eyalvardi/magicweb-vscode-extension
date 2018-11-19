import * as vscode from "vscode";
import { initMagicExtension } from "../magic.extension";

export function addRefreshMetadataCommand(context: vscode.ExtensionContext) {
  const mgptr = vscode.commands.registerCommand('magic.refreshMetadata', () => {
    initMagicExtension(context);
  });
  context.subscriptions.push(mgptr);
}
