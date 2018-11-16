import * as vscode from "vscode";
import { Commands } from "../../schematics/commands";

export function addGenerateAllCommand(context: vscode.ExtensionContext) {
  // Generate All Magic Components
  let genAll = vscode.commands.registerCommand(
    "magic.generateAll",
    async context => {
      const workspaceFolderPath = await Commands.getWorkspaceFolderPath(
        Commands.getContextPath(context)
      );

      await Commands.launchCommand(
        "ng g @magic-xpa/cli:magic",
        workspaceFolderPath,
        "magic",
        ""
      );
    }
  );
  context.subscriptions.push(genAll);
}
