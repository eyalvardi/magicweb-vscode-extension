import * as vscode from 'vscode';

import { MagicData } from "./fetach.programs";
import { ProgramsTreeDataProvider } from './programsTreeDataProvider';
import { addSearchCommand } from './commands/search.command';
import { addGenerateAllCommand } from './commands/generateAll.command';
import { addRefreshTreeCommand } from './commands/refreshcommand';
import { addGenerateControlCommand } from './commands/generateControl.command';
import { addOpenComponentHtmlCommand } from './commands/openHtmlCmp.command';

export const magicData = new MagicData();
export const programsTreeProvider = new ProgramsTreeDataProvider( magicData );
export const magicTreeView = vscode.window.createTreeView<MagicTreeItem>("programsTree",{
    treeDataProvider : programsTreeProvider
  })

export function activatePrograms(context: vscode.ExtensionContext) {
    console.log('Activate MagicWeb Extension');
    //const rootPath = vscode.workspace.rootPath;   
   
    //addMagicTree(context);

    // General commands
    addRefreshTreeCommand(context);
    addSearchCommand(context);  
   
    addOpenComponentHtmlCommand(context);
    
    
    // Generate commands
    addGenerateAllCommand(context);
    addGenerateControlCommand(context);
}


