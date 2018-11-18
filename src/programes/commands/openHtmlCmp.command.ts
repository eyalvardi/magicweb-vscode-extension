import * as vscode from "vscode";
import * as path from 'path';
import { Commands } from "../../schematics/commands";
import { MagicItem } from "../providers/magicTreeItem";
import { programsTreeProvider } from "../magic.extension";

export function addOpenComponentHtmlCommand(context: vscode.ExtensionContext) {
  let highlight = vscode.window.createTextEditorDecorationType({ 
      backgroundColor: 'rgba(200,200,200,.35)',
      border: '1px solid yellow'
    });
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
           
            if(pos === -1) {
                vscode.window.showErrorMessage(`The control: ${context.name} not in the HTML file.`);
                context.mgTreeItem.isGenerate = false;
                programsTreeProvider.refresh(context);
            } else {                      
                let range:vscode.Range = new vscode.Range(
                  editor.document.positionAt(pos),
                  editor.document.positionAt(pos+`magic="${context.name}"`.length)
                  );
                
              let selection = new vscode.Selection(range.start,range.end);           
              editor.selection = selection;          
              editor.setDecorations(highlight, [range]);
              editor.revealRange(range);  
            }           
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
