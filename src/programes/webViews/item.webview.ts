import * as vscode from 'vscode';
import * as ejs from 'ejs';
import * as path from 'path';
import { getView } from './views';
import { env } from '../magic.extension';
import { MgControlType, CtrlButtonTypeGui, SideType, StorageAttributeType, TableWebStyle, RowEditingTypes, WindowType, WindowPosition } from '../../types';
import { MagicItem } from '../providers/MagicTreeItem.class';
import { window, workspace } from 'vscode';
import { Utils } from '../../schematics/utils';


const data     = {
    MgControlType     : MgControlType,
    theme             : "basicHTML",
    CtrlButtonTypeGui : CtrlButtonTypeGui,
    SideType          : SideType,
    StorageAttributeType: StorageAttributeType,
    TableWebStyle     : TableWebStyle,
    RowEditingTypes   : RowEditingTypes,
    WindowType        : WindowType,
    WindowPosition    : WindowPosition,
   // Util              : Util,
  };


export function addMagicItemWebView(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'magic.openItemProperties', 
            async (treeItem : MagicItem,...args: any[]) => {


                const vm     =  Object.assign(data, {                   
                                    ctrl         : treeItem.mgTreeItem.json,
                                    //app        : env.app,
                                    magicConfig  : env.genConfig,
                                });



                        // Create and show a new webview
            //    const panel = window.createWebviewPanel(
            //                 'magicItemProperties',      // Identifies the type of the webview. Used internally
            //                 "Magic Item Properties",    // Title of the panel displayed to the user
            //                 ViewColumn.One,             // Editor column to show the new webview panel in.
            //                 { }                         // Webview options. More on these later.
                    
            //     );  

                // And set its HTML content
               // panel.webview.html = await createView('item.view',vm.ctrl);
               const result = await createView('./component/view.component.html',vm);
               
               //panel.webview.html = createPage(result);


               createHtmlComponent(treeItem,result);

      
       
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


async function createHtmlComponent(treeItem:MagicTreeItem,source:string){
    if(!treeItem || !treeItem.path ) return;
    const fileName = treeItem.type == "form" ? treeItem.name : treeItem.component;
    const filePath = path.join( env.vsWorkspace ,'src/app/magic' ,treeItem.path , `${fileName}.test.component.html`);
    
    await Utils.writeFileAsync(filePath,source);    
    const document = await workspace.openTextDocument(filePath);
    await window.showTextDocument(document);
    vscode.commands.executeCommand('editor.action.formatDocument');
}

// @ts-nocheck
async function createView(view: string, vm: any): Promise<any> {
    const basePath = path.resolve(__dirname, `../../../ejs`);
    const filePath = path.join   (basePath , `${view}.ejs`);

    return new Promise( (resolve , reject) => {
        ejs.renderFile( filePath , vm , ( err , output) => {
            if(err) { reject(err.message); };
            resolve(output as string);
        } );
    } );
}

export function createPage(content:string):string {
    const htmlPageTemp = //html
                `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                    <h1>Demo Eyal</h1>
                    
                        ${content}
                       
                    
                </body>
                </html>
                `
    return htmlPageTemp;
}