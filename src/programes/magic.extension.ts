import * as vscode from 'vscode';
import { window, ExtensionContext, TreeView, TreeViewVisibilityChangeEvent, workspace } from 'vscode';

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
export const magicTreeView : TreeView<MagicTreeItem> = window.createTreeView<MagicTreeItem>( "magicTreeExplorer" , {
                                    treeDataProvider : programsTreeProvider
});

export const magicTreeActivityBar : TreeView<MagicTreeItem> = window.createTreeView<MagicTreeItem>( "magicTreeActivityBar" , {
    treeDataProvider : programsTreeProvider
});

export async function initMagicExtension(context: ExtensionContext) : Promise<void>{
    try{
        await env.refresh();        
        if(env.magicProjects.length > 0 ){
            vscode.commands.executeCommand('setContext', 'inMagicProject', true);
            genCli = new GenerateCli(context);
            activateMagic(context);
            initEvents(context);                   
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

function initEvents(context: ExtensionContext){
    context.subscriptions.push(
        magicTreeView.onDidChangeVisibility( (e:TreeViewVisibilityChangeEvent) => {
          vscode.commands.executeCommand('setContext', 'magicTree', e.visible);
        })
    );

    context.subscriptions.push(
        magicTreeActivityBar.onDidChangeVisibility( (e:TreeViewVisibilityChangeEvent) => {
          vscode.commands.executeCommand('setContext', 'magicTree', e.visible);
        })
    );

    // context.subscriptions.push(
    //     workspace.onDidChangeConfiguration(cfg => {
    //         if (cfg.affectsConfiguration("bookmarks.treeview.visible")) {
    //             programsTreeProvider.refresh();
    //         }
    //     })
    // );
}


