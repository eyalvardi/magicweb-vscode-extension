import * as vscode from 'vscode';
import { MagicData } from "./fetach.programs";
import { ProgramsTreeDataProvider } from './programsTreeDataProvider';

export const magicData = new MagicData();

export async function programsList(){
    await magicData.loadJson(); 
    let programsList = magicData.getPrograms() as MagicTreeItem[];
    vscode.window.showQuickPick( programsList.map(p=>p.name) );
}


export function activatePrograms(context: vscode.ExtensionContext) {
    console.log('activate programs');
    const rootPath = vscode.workspace.rootPath;   
   

    // Show Quick Pick
    let mgpl = vscode.commands.registerCommand('magic.programsList',programsList);
    context.subscriptions.push(mgpl);

    // Show Programs Tree
    const programsTreeProvider = new ProgramsTreeDataProvider( rootPath , magicData );
    vscode.window.registerTreeDataProvider("programsTree",programsTreeProvider)
    let mgptr = vscode.commands.registerCommand('programsTree.refresh', () => programsTreeProvider.refresh());
    context.subscriptions.push(mgptr);
}
export function deactivate(){

}