import * as vscode from "vscode";
import * as path from 'path';
import { Commands } from "../../../schematics/commands";

export function addGenerateComponentCommand(context: vscode.ExtensionContext) {
  const gcc = vscode.commands.registerCommand('magic.generateComponent', async (context) => {

    const workspaceFolderPath = await Commands.getWorkspaceFolderPath();
    const schematicsCommand = `ng g @magic-xpa/cli:magic --component=${context.path}${context.name} --project=${context.project}`;
    await Commands.launchCommand(
        schematicsCommand,
        workspaceFolderPath,
        "magic",
        ""
    );

    const filePath = path.join( workspaceFolderPath , context.path , `${context.name}.component.html`);
    const document = await vscode.workspace.openTextDocument( filePath );
    await vscode.window.showTextDocument(document);
});
context.subscriptions.push(gcc);
}
