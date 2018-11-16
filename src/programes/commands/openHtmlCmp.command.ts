import * as vscode from "vscode";
import * as path from 'path';
import { Commands } from "../../schematics/commands";

export function addOpenComponentHtmlCommand(context: vscode.ExtensionContext) {
  const gcc = vscode.commands.registerCommand('magic.openComponentHtml', async (context) => {

    const workspaceFolderPath = await Commands.getWorkspaceFolderPath();
    const filePath = path.join( workspaceFolderPath , context.path , `${context.name}.component.html`);
    const document = await vscode.workspace.openTextDocument( filePath );
    await vscode.window.showTextDocument(document);
});
context.subscriptions.push(gcc);
}
