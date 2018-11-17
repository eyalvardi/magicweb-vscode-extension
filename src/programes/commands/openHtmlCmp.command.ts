import * as vscode from "vscode";
import * as path from 'path';
import { Commands } from "../../schematics/commands";
import { MagicItem } from "../providers/magicTreeItem";

export function addOpenComponentHtmlCommand(context: vscode.ExtensionContext) {
    const gcc = vscode.commands.registerCommand('magic.openComponentHtml', async (context : MagicItem,...args:any[]) => {

      if(!context) return;

      if(context.path && context.type === "form"){

          const workspaceFolderPath = await Commands.getWorkspaceFolderPath();      
          const filePath = path.join( workspaceFolderPath , context.path , `${context.name}.component.html`);
          const document = await vscode.workspace.openTextDocument( filePath );
          await vscode.window.showTextDocument(document);
      }
      if(context.type === "field") {    
          if(vscode.window.activeTextEditor){
            let editor = vscode.window.activeTextEditor;
            let html = editor.document.getText();
            let pos  = html.indexOf(`magic="${context.name}"`);
            //let range= `magic=${item.name}`.length;
            let range:vscode.Range = new vscode.Range(
              editor.document.positionAt(pos),
              editor.document.positionAt(pos+`magic="${context.name}"`.length)
              );
            //let docPos : vscode.Position = editor.document.positionAt(pos);
            
           let selection = new vscode.Selection(range.start,range.end);           
           editor.selection = selection; 
          //  editor.edit((eb)=>{
          //    eb.
          //  })          
          }
      }
    
    });
  context.subscriptions.push(gcc);
}

export function createOpenCmpHtmlCommand(treeItem: MagicItem){
  return {
    command    : "magic.openComponentHtml",
    title      : treeItem.name,
    arguments  : [treeItem]
  }
}
