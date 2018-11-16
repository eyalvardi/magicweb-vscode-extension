'use strict';
import * as vscode from 'vscode';
import { activatePrograms } from './programes/programs.commands';
import { Output } from './schematics/output';


export function activate(context: vscode.ExtensionContext) {

    vscode.commands.executeCommand('setContext', 'inMagicProject', true);
    activatePrograms(context);
}

// this method is called when your extension is deactivated
export function deactivate() {
    Output.dispose();
    console.log('Deactivate MagicWeb Extension');
}