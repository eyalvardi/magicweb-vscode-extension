import * as vscode from "vscode";
import { programsTreeProvider } from "../magic.extension";

export function addRefreshTreeCommand(context: vscode.ExtensionContext) {
  let mgptr = vscode.commands.registerCommand('magic.refresh', () => programsTreeProvider.refresh());
  context.subscriptions.push(mgptr);
}
