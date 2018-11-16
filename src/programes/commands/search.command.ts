import * as vscode from "vscode";

import { magicData }            from '../programs.commands';
import { ShowPreviewCommand }   from './ShowPreviewCommand';
import { MagicItem }            from '../magicTreeItem';

export function addSearchCommand( context:  vscode.ExtensionContext ) {
    // Show Quick Pick
    let mgpl = vscode.commands.registerCommand('magic.searchProgram',async()=>{
        await magicData.loadJson(); 
        let programsList = magicData.getPrograms() as MagicTreeItem[];
        const qp = vscode.window.createQuickPick();
        qp.placeholder = "Type to search Magic item";
        qp.onDidChangeValue( value => {
            qp.busy  = true; 
            if(value) {
                
                if(qp.value != value ) return;
    
                qp.items = programsList
                        .filter( item=> item.name.includes(value) )
                        .map( item => ({
                            label : item.name,
                            item  : item
                        }));
            } else {
                qp.items =  programsList.map(item=>({
                    label : item.name
                }))
            }            
            qp.busy  = false;            
        });
        qp.onDidAccept(()=>{
            const item = (<any>qp.selectedItems[0]).item as MagicItem;
            const cmd  = new ShowPreviewCommand(item); 
            vscode.commands.executeCommand(cmd.command,cmd.arguments[0]);
        })
        qp.show();
    });
    context.subscriptions.push(mgpl);
}