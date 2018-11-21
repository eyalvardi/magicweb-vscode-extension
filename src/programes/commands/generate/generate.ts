import * as vscode from "vscode";
import { Commands, ExplorerMenuContext } from "../../../schematics/commands";

export class GenerateCli {
    
    workspaceFolderPath:string = "";

    constructor( public context: vscode.ExtensionContext ){       
    }
    
    async init(context: ExplorerMenuContext){
        this.workspaceFolderPath = await Commands.getWorkspaceFolderPath(
            Commands.getContextPath(context)
          );
    }

    async generate(options?:any){
        return await Commands.launchCommand(
            `ng g @magic-xpa/cli:magic --project=${options.project} --theme=${options.theme}`,
            this.workspaceFolderPath,
            "magic",
            ""
          );
    }
}