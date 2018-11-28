import * as vscode from "vscode";
import json5 = require("json5");
import { MagicItem } from "./MagicTreeItem.class";
import { magicTreeView } from "../magic.extension";
import { TreeViewVisibilityChangeEvent } from "vscode";


export function addTextDocProvider(context: vscode.ExtensionContext) {
  
  const mg1 = vscode.workspace.registerTextDocumentContentProvider( "magic" , {
    provideTextDocumentContent( uri ) {
        const item = JSON.parse(uri.fragment) as MagicItem;
        let result = `
            # ${item.mgTreeItem.type} ${item.mgTreeItem.name}
            The ${item.mgTreeItem.type} ${item.mgTreeItem.name} is generate at ??? and update at ???.
            ===================================
            ${json5.stringify(item.mgTreeItem)}
        `;
        // return vscode.commands.executeCommand('markdown.showPreview',result)
        // .then(value=>{
        //   return result;
        // });
        return result;
    }
  })
  context.subscriptions.push(mg1);
  
  context.subscriptions.push(
    magicTreeView.onDidChangeVisibility( (e:TreeViewVisibilityChangeEvent) => {
      vscode.commands.executeCommand('setContext', 'magicTree', e.visible);
    })
  );
}
