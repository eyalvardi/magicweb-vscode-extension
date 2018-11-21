import * as vscode from 'vscode';
import * as path from 'path';
import { Utils } from "./schematics/utils";
import { Commands } from './schematics/commands';
import { MagicData } from './programes/magic.data';

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
    rootPath            : string = "";
    parentFolderName    : string = "";
    ngrWorkspace        : any;
    vsWorkspace         : any;
    projects = new Map< string , { magic : MagicData, angular : NgProject }>();

    isMagicProject(name:string) : boolean {
        return this.projects.has(name);
    }

    isAngularWorkspace(){
        return this.ngrWorkspace || false;
    }

    get magicMetadataPaths() : string []{
        if( this.projects.size === 0 ) return [];
        return Array.from(this.projects.values()).map( prj => prj.angular.root || 'root folder' );
    }

    async loadAngularWorkspace() : Promise<void> {
        const workspaceFolderPath = await Commands.getWorkspaceFolderPath();      
        const filePath = path.join( workspaceFolderPath , 'angular.json' );

        const json = await Utils.readFileAsync(filePath);
        this.ngrWorkspace = JSON.parse(json);
        const projects    = this.ngrWorkspace.projects;

        const prjNames = Object.keys(projects);

        this.projects.clear();

        for (let i = 0; i < prjNames.length; i++) {
            const projectName = prjNames[i];
            const result = await isMagicProject(projects[projectName]);
            if( result ){
                let prj = projects[projectName];
                prj.name= prjNames[i];
                this.projects.set(projectName, {
                    angular : projects[projectName],
                    magic   : new MagicData(projectName)
                } );
            }            
        }        
    }

    async loadMagicMetadata(project?:string) {
        if(project && this.projects.has(project)){
            const prj =  this.projects.get(project);
            if(!prj) return;  
            await prj.magic.loadJson(prj.angular.root);

        }else{
            const promises = [];
            for(let prj of this.projects.values()){
                promises.push( prj.magic.loadJson(prj.angular.root) );
            }
            await Promise.all(promises);
        }
    }

    async refresh() : Promise<void>{
        await this.loadAngularWorkspace();
        await this.loadMagicMetadata();
    }
}
