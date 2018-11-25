import * as vscode from "vscode";
import { commands } from "vscode";
import { env } from "../magic.extension";

export function addSearchCommand( context:  vscode.ExtensionContext ) {
    // Show Quick Pick
    let mgpl = commands.registerCommand('magic.searchForms',async()=>{
        let forms = Array.from(env.projects.values())
                        .map   ( prj => prj.magic)
                        .filter( prj => prj.isMagicProject)
                        .map   ( prj => prj.forms)
                        .map   ( frm => Array.from(frm.values()) )
                        .reduce( ( prev , curr) => [...prev,...curr] );

        const qp = vscode.window.createQuickPick();
        qp.placeholder = "Type to search Magic form";
        qp.onDidChangeValue( value => {
            qp.busy  = true; 
            if(value) {
                
                if(qp.value != value ) return;
    
                qp.items = forms
                        .filter( item => item.name.includes(value) )
                        .map( item => ({
                            label : item.name,
                            item  : item
                        }));
            } else {
                qp.items =  forms.map(item=>({
                    label : item.name
                }))
            }            
            qp.busy  = false;            
        });
        qp.onDidAccept(()=>{
            const item = (<any>qp.selectedItems[0]).item as MagicTreeItem;
            const cmd  = {
                command   : 'magic.openComponentHtml',
                arguments : [item]
            };
            vscode.commands.executeCommand(cmd.command,cmd.arguments[0]);
        })
        qp.show();
    });
    context.subscriptions.push(mgpl);
}