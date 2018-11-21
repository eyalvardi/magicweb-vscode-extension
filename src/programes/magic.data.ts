import * as vscode  from 'vscode';
import { Utils } from "../schematics/utils";
import * as path    from 'path';
import * as fs      from 'fs';
import * as JSON5   from 'json5';
import { MagicItem } from './providers/magicTreeItem';

export async function fetchPrograms() : Promise<MagicTreeItem[]>{
    const filePath = path.join(vscode.workspace.rootPath || "","magic-metadata/magic.config.json");
    console.log(`magic-metadata: ${filePath}`);

    const str  = await Utils.readFileAsync(filePath);
    //const json = await res.json();
    return JSON5.parse(str);  
}

export const MgNames = {
    metadata        : "magic-metadata",
    configFile      : "config",
    serverConfig    : "server-config"
};

export async function loadMetadata(project:string, pathStr:string) : Promise<any>{
    const dirPath = path.join(vscode.workspace.rootPath || "","magic-metadata");
    let names     = await Utils.readDirAsync( dirPath );
    let stats     = await Promise.all( names.map( name => Utils.readStatsAsync(`${dirPath}\\${name}`) ) );

    return readChildren(names,stats,dirPath,0,project);

}

export async function readFolder( magicType: MagicTypeItem ,folderName : string, folderPath:string,level:number,project:string) : Promise<MagicTreeItem>{
    let names     = await Utils.readDirAsync( folderPath );
    let stats     = await Promise.all( names.map( name => Utils.readStatsAsync(`${folderPath}\\${name}`) ) );

    return {
        id       : folderName,
        type     : magicType,
        icon     : magicType,
        name     : folderName,
        path     : folderPath,
        project  : project,
        children : await readChildren(names,stats,folderPath,level++,project)
    }
}

export async function  readChildren(names : string[] ,stats : fs.Stats[],folderPath:string,level:number,project:string) : Promise<MagicTreeItem[]>{
    let result : MagicTreeItem[] = [];
    for(let i = 0 ; i < stats.length ; i++){
        let type : fs.Stats = stats[i];
        let filePath = `${folderPath}\\${names[i]}`;
        // Magic Folders
        if( type.isDirectory() && level === 0){
            if( await isMagicForm(filePath) ) {
                result.push(await readFolder( "program" ,names[i],filePath,level+1,project));            
            }else {
                result.push(await readFolder( "folder" ,names[i],filePath,level+1,project));
            }
        }
        // Magic Programs
        else if( type.isDirectory() && level === 1){
            result.push(await readFolder( "program" ,names[i],filePath,level+1,project));
        } 
        // Magic Tasks or Forms
        else if (type.isDirectory() && level > 1){
           result.push(await readFolder( "task" ,names[i],filePath,level+1,project));
                        
        } else if( !type.isDirectory() && level > 1){
            result.push(await readForm( filePath,level+1,project));
        }
    }

    return result;
}

export async function isMagicForm(folderPath:string) : Promise<boolean>{
    let names = await Utils.readDirAsync( folderPath );
    return names.filter(n=>n.includes('.json')).length > 1;
}

export async function readForm( folderPath:string, level:number,project:string ) : Promise<MagicTreeItem>{
    let file = await Utils.readFileAsync( folderPath );
    let json = JSON.parse(file);
    addMetadataToItem(project,json.props.component_path,json.props.id,json.children);

    return new MagicItem( {
        id       :  json.props.id,
        type     : "form",
        icon     : "form",
        name     : json.props.id,
        path     : json.props.component_path,
        project  : project,
        controls : json.children
    } );
}

function addMetadataToItem(project:string,path:string,cmp:string,children: any[]) : void{
    if(!children) return;
    
    for (let i = 0; i < children.length; i++) {
        const element     = children[i];
        element.project   = project;
        element.path      = path;
        element.component = cmp;
        element.icon      = `controls/${element.controlType}`;
        addMetadataToItem(project,path,cmp, element.children);
        
    }
}

export class MagicData {
    
    tree : MagicTreeItem [] = [];
    isMagicProject : boolean = false;
    projectName : string;
    icon        : string = "rootFolder"
    
    folders     = new Map<number | string ,MagicTreeItem>();
    programs    = new Map<number | string ,MagicTreeItem>();
    tasks       = new Map<number | string ,MagicTreeItem>();
    forms       = new Map<number | string ,MagicTreeItem>();

    constructor( projectName:string , json:MagicTreeItem[] = [] ) {
        this.projectName = projectName;
        this.proccessJson(json);
    }

    getPrograms(id?:number) : MagicTreeItem | MagicTreeItem []{
        let result :  MagicTreeItem | MagicTreeItem [];               
        if(id){
            result = this.programs.get(id) as MagicTreeItem; //TODO: if null
        } else {
            result = Array.from(this.programs.values());
        }
        return result;
    }

    async loadJson(path:string = '' ) : Promise<MagicData> {
        try {
            this.tree = await loadMetadata(this.projectName,path);
        } catch (error) {
            this.tree = [];           
        }     
     
        this.isMagicProject = this.tree.length === 0 ? false : true;
        return this;  
    }

    proccessJson(json:MagicTreeItem[]) {
        json.forEach( item => {
            switch (item.type) {
                case "folder":
                    this.folders.set(item.name,item);                   
                    break;
                case "program":
                    this.programs.set(item.name,item);
                    break;
                case "task":
                    this.tasks.set(item.name,item);
                    break;
                case "form":
                    this.forms.set(item.name,item);
                    break;
            }
            if(item.children && item.children.length > 0){
                this.proccessJson(item.children);          
            }            
        });       
    }
}
