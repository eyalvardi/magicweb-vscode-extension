import * as vscode from "vscode";
import { env, genCli } from "../../magic.extension";

export function addGenerateAllCommand(context: vscode.ExtensionContext) {
  // Generate All Magic Components
  let genAll = vscode.commands.registerCommand(
    "magic.generateAll",

    async (context) => {
      const magicPrj = Array.from( env.projects.keys() );
      const qp = vscode.window.createQuickPick();
      qp.items = magicPrj.map( item => ({ label : item, item  : item }));
      qp.placeholder = "Select the project to generate";
      qp.onDidChangeValue( value => {
      qp.busy  = true; 
      if(value) {            
          if(qp.value != value ) return;
          qp.items = magicPrj
                  .filter( item=> item.includes(value) )
                  .map( item => ({ label : item, item  : item }));
      } else {
          qp.items =  magicPrj.map(item=>({label : item }))
      }            
      qp.busy  = false;            
      });
      qp.onDidAccept(async () => {
          const item = (<any>qp.selectedItems[0]).item;

         await genCli.init(context);
         await genCli.generate({project: item})

          // const workspaceFolderPath = await Commands.getWorkspaceFolderPath(
          //   Commands.getContextPath(context)
          // );
          // await Commands.launchCommand(
          //   `ng g @magic-xpa/cli:magic --project=${item}`,
          //   workspaceFolderPath,
          //   "magic",
          //   ""
          // );
      })
      qp.show();
}


    // async context => {
    //     const workspaceFolderPath = await Commands.getWorkspaceFolderPath(
    //       Commands.getContextPath(context)
    //     );

    //     await Commands.launchCommand(
    //       "ng g @magic-xpa/cli:magic",
    //       workspaceFolderPath,
    //       "magic",
    //       ""
    //     );
    // }
  );
  context.subscriptions.push(genAll);
}
