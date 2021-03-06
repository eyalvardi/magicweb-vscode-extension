import * as vscode from "vscode";
import * as path from 'path';
import { Commands } from "../../../schematics/commands";
import { env } from "../../magic.extension";

export function addGenerateComponentCommand(context: vscode.ExtensionContext) {
  const gcc = vscode.commands.registerCommand('magic.generateComponent', async (context) => {

    const workspaceFolderPath = await Commands.getWorkspaceFolderPath();

    await env.genConfig.generateComponent(context);

    const schematicsCommand = `ng g @magic-xpa/cli:magic --project=${context.project}`; //--component=${context.path}${context.name}
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
