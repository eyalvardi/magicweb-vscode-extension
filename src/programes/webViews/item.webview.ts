import * as vscode from 'vscode';
import { getView } from './views';

export function addMagicItemWebView(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'magic.openItemProperties', 
            async (...args: any[]) => {
                        // Create and show a new webview
                    const panel = vscode.window.createWebviewPanel(
                            'magicItemProperties',      // Identifies the type of the webview. Used internally
                            "Magic Item Properties",    // Title of the panel displayed to the user
                            vscode.ViewColumn.One,      // Editor column to show the new webview panel in.
                            { }                         // Webview options. More on these later.
                    
                      );       
                    // And set its HTML content
                    panel.webview.html = await getView('magic-item.report',args[0]); 
      
       
    }));

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'magic.openSetting', 
            async (...args: any[]) => {
                        // Create and show a new webview
                    const panel = vscode.window.createWebviewPanel(
                            'magicOpenSetting',
                            "MagicWeb Setting",
                            vscode.ViewColumn.One,
                            { 
                                enableScripts: true
                            }                   
                    
                      );
                      
                    // Handle messages from the webview
                    panel.webview.onDidReceiveMessage( message => {
                        vscode.window.showInformationMessage(message.text);  
                        vscode.commands.executeCommand(message.command);
                    }, undefined, context.subscriptions);

                    // And set its HTML content
                    panel.webview.html = await getView('magicWeb.setting',args[0]); 
      
       
    }));
}

