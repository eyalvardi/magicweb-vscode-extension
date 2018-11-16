import * as vscode from 'vscode';
import { MagicData } from "./fetach.programs";
import { ProgramsTreeDataProvider } from './programsTreeDataProvider';
import { MagicItem } from './magicTreeItem';
import { ShowPreviewCommand } from './commands/ShowPreviewCommand';
import { Commands } from '../schematics/commands';
import { Schematics } from '../schematics/schematics';

export const magicData = new MagicData();

export async function programsList(){
    await magicData.loadJson(); 
    let programsList = magicData.getPrograms() as MagicTreeItem[];
    //vscode.window.showQuickPick( programsList.map(p=>p.name) );
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

}

const mgTextProvider : vscode.TextDocumentContentProvider = {
    provideTextDocumentContent( uri ) {
        const item = JSON.parse(uri.fragment) as MagicItem;
        return `
            # ${item.mgTreeItem.type} ${item.mgTreeItem.name}
            The ${item.mgTreeItem.type} ${item.mgTreeItem.name} is generate at ??? and update at ???.
        `;
    }
};

export function activatePrograms(context: vscode.ExtensionContext) {
    console.log('activate programs');
    //const rootPath = vscode.workspace.rootPath;   
   

    // Show Quick Pick
    let mgpl = vscode.commands.registerCommand('magic.programsList',programsList);
    context.subscriptions.push(mgpl);

    // Show Programs Tree
    const programsTreeProvider = new ProgramsTreeDataProvider( magicData );
    vscode.window.registerTreeDataProvider("programsTree",programsTreeProvider)
    let mgptr = vscode.commands.registerCommand('programsTree.refresh', () => programsTreeProvider.refresh());
    context.subscriptions.push(mgptr);

    // ????
    let mg1 = vscode.workspace.registerTextDocumentContentProvider( "magic" , mgTextProvider )
    context.subscriptions.push(mg1);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const gcc = vscode.commands.registerCommand('magic.generateComponent', async (context) => {

        await Commands.generate(context, {
            collectionName: Schematics.angularCollection,
            schemaName: 'component'
        });

    });
    context.subscriptions.push(gcc);

}
export function deactivate(){

}

