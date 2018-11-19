import * as vscode from 'vscode';

import { MagicData } from "./magic.data";
import { MagicTreeDataProvider } from './providers/programsTreeDataProvider';
import { addSearchCommand } from './commands/search.command';
import { addGenerateAllCommand } from './commands/generate/generateAll.command';
import { addRefreshTreeCommand } from './commands/refreshTree.command';
import { addGenerateComponentCommand } from './commands/generate/generateComponent.command';
import { addOpenComponentHtmlCommand } from './commands/openHtmlCmp.command';
import { addTextDocProvider } from './providers/textDoc.provider';
import { addMagicItemWebView } from './webViews/item.webview';
import { addGenerateControlCommand } from './commands/generate/generateControl.command';
import { MagicEnv } from '../env';

export const env = new MagicEnv();


export const magicData = new MagicData();
export const programsTreeProvider = new MagicTreeDataProvider( magicData );
export const magicTreeView = vscode.window.createTreeView<MagicTreeItem>("programsTree",{
                                    treeDataProvider : programsTreeProvider
                                });

export async function initMagicExtension(context: vscode.ExtensionContext) : Promise<void>{
    try{
        await env.loadAngularWorkspace();
        if(env.magicProjects.size > 0 ){
            vscode.commands.executeCommand('setContext', 'inMagicProject', true);
            activateMagic(context);
        } else {
            vscode.commands.executeCommand('setContext', 'inMagicProject', false);
            vscode.window.showErrorMessage('Not found Magic Metadata folder in any Angular prjects.');
        }
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
    }

}                                


export function activateMagic(context: vscode.ExtensionContext) {
    console.log('Activate MagicWeb Extension');
    //const rootPath = vscode.workspace.rootPath;   
   
    //addMagicTree(context);

    // General commands
    addRefreshTreeCommand(context);
    addSearchCommand(context);  
   
    addOpenComponentHtmlCommand(context);
    
    
    // Generate commands
    addGenerateAllCommand(context);
    addGenerateComponentCommand(context);
    addGenerateControlCommand(context);

    // Providers
    addTextDocProvider(context);

    // WebViews
    addMagicItemWebView(context);
}


