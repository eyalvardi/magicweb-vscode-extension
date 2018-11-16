import * as vscode from "vscode";


export function addMagicTree(context: vscode.ExtensionContext) {
  
  // const ptp = vscode.window.registerTreeDataProvider("programsTree",programsTreeProvider);
  // const mg1 = vscode.workspace.registerTextDocumentContentProvider( "magic" , {
  //   provideTextDocumentContent( uri ) {
  //       const item = JSON.parse(uri.fragment) as MagicItem;
  //       return `
  //           # ${item.mgTreeItem.type} ${item.mgTreeItem.name}
  //           The ${item.mgTreeItem.type} ${item.mgTreeItem.name} is generate at ??? and update at ???.
  //           ===================================
  //           ${json5.stringify(item.mgTreeItem)}
  //       `;
  //   }
  // })
  // context.subscriptions.push(mg1,ptp);

  // magicTreeView.onDidExpandElement( event => {
  //   const tree = magicTreeView;
  //   tree.
  //   const element = event.element;
  //   console.log(element.name);
  // })
}
