'use strict';
import * as vscode from 'vscode';
import { activateMagic } from './programes/magic.extension';
import { Output } from './schematics/output';


export function activate(context: vscode.ExtensionContext) {

    vscode.commands.executeCommand('setContext', 'inMagicProject', true);
    activateMagic(context);
}

// this method is called when your extension is deactivated
export function deactivate() {
    Output.dispose();
    console.log('Deactivate MagicWeb Extension');
}