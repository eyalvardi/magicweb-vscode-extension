import * as vscode from 'vscode';
import { window, ExtensionContext, TreeView } from 'vscode';

import { MagicTreeDataProvider } from './providers/MagicTreeDataProvider.class';
import { addTextDocProvider } from './providers/textDoc.provider';
import { addMagicItemWebView } from './webViews/item.webview';
import { MagicEnv } from '../metadata';
import {  magicCompletionInHtmlActivate } from '../magicLang/magicLang.extension';
import { magicDiagnosticActivate } from '../magicLang/diagnostic';

import { 
    GenerateCli, 
    addRefreshTreeCommand, 
    addSearchCommand, 
    addOpenComponentHtmlCommand, 
    addGenerateAllCommand, 
    addGenerateComponentCommand, 
    addGenerateControlCommand, 
    addExpandCommand,
    addCollapseCommand,
    addGenerateFolderCommand
} from './commands';

export const env = new MagicEnv();
export let genCli : GenerateCli;

//export const magicData = new MagicData();
export const programsTreeProvider = new MagicTreeDataProvider(env);
export const magicTreeView : TreeView<MagicTreeItem> = window.createTreeView<MagicTreeItem>( "programsTree" , {
                                    treeDataProvider : programsTreeProvider
                                });

//  magicTreeView.onDidExpandElement( e => {
//     let item = e.element as MagicItem;
//     item.collapsibleState = item.collapsibleState === 1 ? 2 : 1;
//     programsTreeProvider.expand(item);
//  });



export async function initMagicExtension(context: ExtensionContext) : Promise<void>{
    try{
        await env.refresh();        
        if(env.magicProjects.length > 0 ){
            vscode.commands.executeCommand('setContext', 'inMagicProject', true);
            genCli = new GenerateCli(context);
            activateMagic(context);                   
        } else {
            vscode.commands.executeCommand('setContext', 'inMagicProject', false);
            vscode.window.showErrorMessage('Not found Magic Metadata folder in any Angular prjects.');
        }
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
    }
}                                


export function activateMagic(context: ExtensionContext) {
    console.log('Activate MagicWeb Extension');
    //const rootPath = vscode.workspace.rootPath;   
   
    //addMagicTree(context);

    // General commands
    addRefreshTreeCommand(context);
    addSearchCommand(context);  
    addExpandCommand(context);
    addCollapseCommand(context)
    addOpenComponentHtmlCommand(context);
    
    
    // Generate commands
    addGenerateAllCommand(context);
    addGenerateComponentCommand(context);
    addGenerateControlCommand(context);
    addGenerateFolderCommand(context)

    // Providers
    addTextDocProvider(context);

    // WebViews
    addMagicItemWebView(context);

    // Language
    magicCompletionInHtmlActivate(context);  
    magicDiagnosticActivate(context)
}


