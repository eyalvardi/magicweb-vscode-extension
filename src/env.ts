import * as vscode from 'vscode';
import * as path from 'path';
import { Utils } from "./schematics/utils";
import { Commands } from './schematics/commands';




export function getAngularWorkspace(){

}

export async  function  isMagicProject(ngProject:any) : Promise<boolean> {
    const prjPath : string      = ngProject.root;
    const workspaceFolderPath   = await Commands.getWorkspaceFolderPath();      
    const metadataFolderPath    = path.join( workspaceFolderPath , prjPath , 'magic-metadata' );

    return Utils.exists(metadataFolderPath);
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

    magicProjects = new Map< string , any >();

    isMagicProject(name:string) : boolean {
        return this.magicProjects.has(name);
    }

    isAngularWorkspace(){
        return this.ngrWorkspace || false;
    }

    get magicMetadataPaths() : string []{
        if( this.magicProjects.size === 0 ) return [];
        return Array.from(this.magicProjects.values()).map( prj => prj.root || 'root folder' );
    }

    async loadAngularWorkspace() : Promise<void> {
        const workspaceFolderPath = await Commands.getWorkspaceFolderPath();      
        const filePath = path.join( workspaceFolderPath , 'angular.json' );

        const json = await Utils.readFileAsync(filePath);
        this.ngrWorkspace = JSON.parse(json);
        const projects    = this.ngrWorkspace.projects;

        const prjNames = Object.keys(projects);

        this.magicProjects.clear();

        for (let i = 0; i < prjNames.length; i++) {
            const result = await isMagicProject(projects[prjNames[i]]);
            if( result ){
                let prj = projects[prjNames[i]];
                prj.name= prjNames[i];
                this.magicProjects.set(prjNames[i], projects[prjNames[i]] );
            }            
        }        
    }
}

