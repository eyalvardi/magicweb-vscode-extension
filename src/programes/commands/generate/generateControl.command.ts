import * as vscode from "vscode";
import * as path from "path";
import { Commands } from "../../../schematics/commands";
import { env } from "../../magic.extension";
import { window, workspace } from "vscode";

export function addGenerateControlCommand(context: vscode.ExtensionContext) {
  const gcc = vscode.commands.registerCommand(
    "magic.generateControl",
    async context => {
      env.genConfig.generateControl(context);

      const workspaceFolderPath = env.vsWorkspace; //await Commands.getWorkspaceFolderPath();
      const schematicsCommand = `ng g @magic-xpa/cli:single-control --project=${
        context.project
      }`;
      let html = await Commands.launchCommand(
        schematicsCommand,
        workspaceFolderPath,
        "magic",
        ""
      );

      html = html.substr(0, html.length - 'Nothing to be done. '.length);
      html = `
    <!--------  ${context.name} control HTML    ------------------
    ${html}
    ---------------------------->
    `;

      // Open Angular <component name>.component.html
      const filePath = path.join(
        env.vsWorkspace,
        "src/app/magic",
        context.path,
        `${context.component}.component.html`
      );

      const document = await workspace.openTextDocument(filePath);
      const editor   = await window.showTextDocument(document);

      if (!editor) return;

      editor.edit((eb: vscode.TextEditorEdit) => {
        eb.insert(
          editor.selection.anchor,
          html
        );

        window.showInformationMessage(`HTML code added to the file`);
      });
    }
  );
  context.subscriptions.push(gcc);
}
