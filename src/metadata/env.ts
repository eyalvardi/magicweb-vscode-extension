import * as vscode from 'vscode';
import * as path from 'path';
import { Utils } from "../schematics/utils";
import { Commands } from '../schematics/commands';
import { MagicData } from './MagicData.class';
import { MagicItem } from '../programes/providers/MagicTreeItem.class';
import { MagicConfig } from './genConfig';

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
    metadataPath        : string = "";
    ngrWorkspace        : any;
    vsWorkspace         : any;
    genConfig           = new MagicConfig();
    projects = new Map< string , { magic : MagicData, angular : NgProject }>();

    magicProjects : MagicData[] = [];
        
    
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
        this.vsWorkspace = await Commands.getWorkspaceFolderPath();      
        const filePath = path.join(  this.vsWorkspace , 'angular.json' );

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
        this.metadataPath = path.join(vscode.workspace.rootPath || "","magic-metadata");

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
        try {
                await this.loadAngularWorkspace();
                await this.loadMagicMetadata();

                this.magicProjects = Array
                            .from  ( this.projects.values() )
                            .map   ( prj => prj.magic)						   
                            .filter( mgp => mgp.isMagicProject ) as MagicData[];

                await this.genConfig.loadConfig(  path.join(this.metadataPath,'config.json') );

        } catch (error) {
            vscode.window.showErrorMessage(`Env.Refresh error : ${error}`);
        }
                  
    }

    getMagicFormByPath(path:string) : MagicItem {
        //TODO : REGX /src\app\magic(.*).component
        let indexMagic = path.indexOf('\\src\\app\\magic\\');
        let suffix     = path.lastIndexOf('.component');
        let lengthSuffix =  path.length - suffix;
        let leftPath   = path.substring(indexMagic,path.length - lengthSuffix);
        let folderPath = leftPath.substring('\\src\\app\\magic\\'.length);
    
        folderPath = folderPath.replace(/\\/g,'/');
    
        let formsMaps = this.magicProjects.map ( prj => prj.forms );
    
        return formsMaps.map( f => f.get(folderPath) )[0] as MagicItem; 
    }

    getControlsFromPath(path:string,context  : any) : string[] {
       let result : string[]  = [];    
   
       let formsMagicData = this.getMagicFormByPath(path);
   
       if(formsMagicData){
           result = formsMagicData.controlsList
       }                    
       
       return result;
   
    }
}

