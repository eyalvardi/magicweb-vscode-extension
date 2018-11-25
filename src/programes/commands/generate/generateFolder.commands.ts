import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import { env } from "../../magic.extension";
import { MagicData } from "../../../metadata";

export function addGenerateFolderCommand(context: ExtensionContext) {
    
    context.subscriptions.push(        
        vscode.commands.registerCommand(
            "magic.generateFolder",
            async (treeItem) => {
                env.genConfig.addItemsToGenerate(treeItem);
                if( treeItem instanceof MagicData ){ treeItem = treeItem.treeItem; }
                vscode.commands.executeCommand("magic.generateAll", treeItem )
            })
    );    
}