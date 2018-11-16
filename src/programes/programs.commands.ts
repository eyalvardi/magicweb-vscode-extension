import * as vscode from 'vscode';
import * as path from 'path';

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
    console.log('Activate MagicWeb Extension');
    //const rootPath = vscode.workspace.rootPath;   
   

    // Show Quick Pick
    let mgpl = vscode.commands.registerCommand('magic.programsList',programsList);
    context.subscriptions.push(mgpl);

    // Generate All Magic Components
    let genAll = vscode.commands.registerCommand('magic.generateAll',async (context) => {

        const workspaceFolderPath = await Commands.getWorkspaceFolderPath(Commands.getContextPath(context));

        await Commands.launchCommand(
            "ng g @magic-xpa/cli:magic",
            workspaceFolderPath,
            "magic",
            ""
        );

    });
    context.subscriptions.push(genAll);




    // Show Programs Tree
    const programsTreeProvider = new ProgramsTreeDataProvider( magicData );
    vscode.window.registerTreeDataProvider("programsTree",programsTreeProvider)
    let mgptr = vscode.commands.registerCommand('programsTree.refresh', () => programsTreeProvider.refresh());
    context.subscriptions.push(mgptr);

    // ????
    let mg1 = vscode.workspace.registerTextDocumentContentProvider( "magic" , mgTextProvider )
    context.subscriptions.push(mg1);

    const gcc = vscode.commands.registerCommand('magic.generateComponent', async (context) => {

        const workspaceFolderPath = await Commands.getWorkspaceFolderPath();
        const schematicsCommand = `ng g @magic-xpa/cli:magic --component=${context.name}`;
        await Commands.launchCommand(
            schematicsCommand,
            workspaceFolderPath,
            "magic",
            ""
        );

        const filePath = path.join( workspaceFolderPath , context.path , `${context.name}.component.html`);
        const document = await vscode.workspace.openTextDocument( filePath );
        await vscode.window.showTextDocument(document);
    });
    context.subscriptions.push(gcc);

}
export function deactivate(){

}

