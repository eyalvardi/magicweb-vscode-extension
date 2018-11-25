import * as vscode from "vscode";
import * as path from 'path';
import { MagicItem } from "../providers/MagicTreeItem.class";
import { programsTreeProvider, env } from "../magic.extension";
import { workspace, window, Selection, Range, TextEditor, TextEditorDecorationType, commands } from "vscode";

export function addOpenComponentHtmlCommand(context: vscode.ExtensionContext) {
    let highlight = window.createTextEditorDecorationType({ 
        backgroundColor: 'rgba(200,200,200,.35)',
        border: '1px solid yellow'
      });
    const gcc = commands.registerCommand('magic.openComponentHtml', async (context : MagicItem,...args:any[]) => {

      if(!context) return;

      if(context.path && context.type === "form"){
          const filePath = path.join( env.vsWorkspace ,'src/app/magic' ,context.path , `${context.name}.component.html`);
          const document = await workspace.openTextDocument( filePath );
          await window.showTextDocument(document);
      }
      if(context.type === "field") {    
          if(window.activeTextEditor){
            let editor = window.activeTextEditor;
            let html = editor.document.getText();
            let pos  = html.indexOf(`magic="${context.name}"`);
           
            if(pos === -1) {
                window.showErrorMessage(`The control: ${context.name} not in the HTML file.`);
                context.mgTreeItem.isGenerate = false;
                programsTreeProvider.refresh(context);
            } else {
              setDecoratorHighlight ( 
                  editor , 
                  highlight , 
                  pos , 
                  `magic="${context.name}"`.length
              ); 
            }           
          }
      }
    });
  context.subscriptions.push(gcc);
}

function setDecoratorHighlight( editor : TextEditor, highlight: TextEditorDecorationType  , position:number , length:number ){
    let range = new Range(
      editor.document.positionAt( position ),
      editor.document.positionAt( position+length )
    );

    let selection    = new Selection(range.start,range.end);           
    editor.selection = selection;          
    editor.setDecorations( highlight , [range]);
    editor.revealRange(range);  
}

export function createOpenCmpHtmlCommand(treeItem: MagicItem){
  return {
    command    : "magic.openComponentHtml",
    title      : treeItem.name,
    arguments  : [treeItem]
  }
}
