import * as vscode from 'vscode';
import * as path from 'path';

import { Utils } from "./schematics/utils";


export function getAngularWorkspace(){

}

export function  isMagicProject(name:string) : boolean {
    return true;
}


export function getDefaultWorkspace(): vscode.WorkspaceFolder | null {

    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {
        return vscode.workspace.workspaceFolders[0];
    }
    return null;
}

export async function getWorkspaceFolderPath(path = ''): Promise<string> {
    const workspaceFolder = path ?
        vscode.workspace.getWorkspaceFolder(vscode.Uri.file(path)) :
        (getDefaultWorkspace() || await vscode.window.showWorkspaceFolderPick());

    return workspaceFolder ? workspaceFolder.uri.fsPath : '';
}


export class MagicEnv {

    ngrWorkspace : any;
    vsWorkspace  : any;

    magicProjects = new Map< string , Project >();

    isMagicProject(name:string) : boolean {
        return this.magicProjects.has(name);
    }

    isAngularWorkspace(){
        return this.ngWorkspace || false;
    }

    async loadAngularWorkspace() : Promise<void> {
        const json = await Utils.readFileAsync('angular.json');
        this.ngrWorkspace = JSON.stringify(json);
        this.ngrWorkspace.projects.forEach( prj => {
            if( isMagicProject(prj) ){
                this.magicProjects.set(prj, this.ngrWorkspace.projects[prg] );
            }
        });
    }


}

