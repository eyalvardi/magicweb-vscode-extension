import * as vscode from 'vscode';

export function addMagicItemWebView(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'magic.openItemProperties', 
            (...args: any[]) => {
                        // Create and show a new webview
                    const panel = vscode.window.createWebviewPanel(
                            'magicItemProperties',      // Identifies the type of the webview. Used internally
                            "Magic Item Properties",    // Title of the panel displayed to the user
                            vscode.ViewColumn.One,      // Editor column to show the new webview panel in.
                            { }                         // Webview options. More on these later.
                    
                      );       
                    // And set its HTML content
                    panel.webview.html = createView(args[0]);        
       
    }));
}

function createView(magicItem:MagicTreeItem){
    if(!magicItem){ return 'No data !';}

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${magicItem.name}</title>
        </head>
        <body>
            <h2>${ magicItem.type}: ${magicItem.name}</h2>
            <pre>
                ${JSON.stringify(magicItem)}
            </pre>
            <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
        </body>
        </html>
    `
}