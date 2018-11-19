'use strict';
import * as vscode from 'vscode';
import { initMagicExtension } from './programes/magic.extension';
import { Output } from './schematics/output';
import { addRefreshMetadataCommand } from './programes/commands/refreshMetadata.command';


export function activate(context: vscode.ExtensionContext) {  
    vscode.commands.executeCommand('setContext', 'inMagicProject', false);
    addRefreshMetadataCommand(context);
      
    initMagicExtension(context);
}

// this method is called when your extension is deactivated
export function deactivate() {
    Output.dispose();
    console.log('Deactivate MagicWeb Extension');
}