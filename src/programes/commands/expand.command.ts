import { commands, ExtensionContext} from "vscode";
import { programsTreeProvider } from "../magic.extension";
import { MagicItem } from "../providers/MagicTreeItem.class";


export function addExpandCommand(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('magic.expand', async (treeItem : MagicItem) => {
            programsTreeProvider.expand(treeItem);
        })
    )
}

export function addCollapseCommand(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('magic.collapse', async (treeItem : MagicItem) => {
            programsTreeProvider.collapse(treeItem);
        })
    )
}