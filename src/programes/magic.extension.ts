import * as vscode from 'vscode';

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
import { GenerateCli } from './commands/generate/generate';
import { magiclanguageActivate } from '../magicLang/magicLang.extension';

export const env = new MagicEnv();
export let genCli : GenerateCli;

//export const magicData = new MagicData();
export const programsTreeProvider = new MagicTreeDataProvider(env);
export const magicTreeView = vscode.window.createTreeView<MagicTreeItem>("programsTree",{
                                    treeDataProvider : programsTreeProvider
                                });



export async function initMagicExtension(context: vscode.ExtensionContext) : Promise<void>{
    try{
        await env.loadAngularWorkspace();
        await env.loadMagicMetadata();
        if(env.projects.size > 0 ){
            vscode.commands.executeCommand('setContext', 'inMagicProject', true);
            genCli = new GenerateCli(context);
            activateMagic(context);
            magiclanguageActivate(context);
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


