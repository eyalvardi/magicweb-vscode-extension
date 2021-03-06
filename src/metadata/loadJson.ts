import * as vscode  from 'vscode';
import { Utils } from "../schematics/utils";
import * as path    from 'path';
import * as fs      from 'fs';
import * as JSON5   from 'json5';
import { MagicItem } from '../programes/providers/MagicTreeItem.class';
import { env } from '../programes/magic.extension';


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

export async function loadMetadata(project:string, pathStr:string, parent? : MagicTreeItem) : Promise<any>{    
    let names     = await Utils.readDirAsync( env.metadataPath );
    let stats     = await Promise.all( names.map( name => Utils.readStatsAsync(`${env.metadataPath}\\${name}`) ) );

    return readChildren(names,stats,env.metadataPath,0,project,parent);

}

export async function readFolder( magicType: MagicTypeItem ,folderName : string, folderPath:string,level:number,project:string,parent:MagicTreeItem | undefined) : Promise<MagicTreeItem>{
    let names     = await Utils.readDirAsync( folderPath );
    let stats     = await Promise.all( names.map( name => Utils.readStatsAsync(`${folderPath}\\${name}`) ) );

    let folderTreeItem = new MagicItem( {
        id       : folderName,
        type     : magicType,
        icon     : magicType,
        name     : folderName,
        path     : folderPath,
        project  : project,
        parent   : parent       
    } as MagicTreeItem );
    
    folderTreeItem.mgTreeItem.children = await readChildren(names,stats,folderPath,level++,project,folderTreeItem);
    if(folderTreeItem.mgTreeItem.children.length > 0 ){
        folderTreeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }

    return folderTreeItem;

}

export async function  readChildren(names : string[] ,stats : fs.Stats[],folderPath:string,level:number,project:string,parent? : MagicTreeItem) : Promise<MagicTreeItem[]>{
    let result : MagicTreeItem[] = [];
    for(let i = 0 ; i < stats.length ; i++) {
        let type : fs.Stats = stats[i];
        let filePath = `${folderPath}\\${names[i]}`;
        ////////////////////////////////////////////
        // LEVEL 0: Magic Folders
        ////////////////////////////////////////////
        if( type.isDirectory() && level === 0){
            if( await isMagicForm(filePath) ) {
                result.push(await readFolder( "program" ,names[i],filePath,level+1,project,parent));            
            }else {
                result.push(await readFolder( "folder" ,names[i],filePath,level+1,project,parent));
            }
        }
        ////////////////////////////////////////////
        // LEVEL 1: Program or Form
        ////////////////////////////////////////////
        // Magic Programs
        else if( type.isDirectory() && level === 1){
            result.push(await readFolder( "program" ,names[i],filePath,level+1,project,parent));
        } 
        // Magic Form
        else if( !type.isDirectory() && level === 1){
            result.push(await readForm( filePath,level,project,parent));
        }
        ////////////////////////////////////////////
        // LEVEL > 1 Task or Form
        ////////////////////////////////////////////
        // Magic Tasks
        else if (type.isDirectory() && level > 1){
           result.push(await readFolder( "task" ,names[i],filePath,level+1,project,parent));
                        
        } 
        // Magic Form
        else if( !type.isDirectory() && level > 1){
            result.push(await readForm( filePath,level+1,project,parent));
        }
    }

    return result;
}

export async function isMagicForm(folderPath:string) : Promise<boolean>{
    let names = await Utils.readDirAsync( folderPath );
    return names.filter(n=>n.includes('.json')).length > 1;
}

export async function readForm( folderPath:string , level:number , project:string , parent : MagicTreeItem | undefined) : Promise<MagicTreeItem>{
    let file = await Utils.readFileAsync( folderPath );
    let json = JSON.parse(file);

    // Fix the controls data
    addMetadataToItem( 
        project, 
        json.props.component_path, 
        json.props.id, 
        json.children 
    );

    return new MagicItem( {
        id       :  json.props.id,
        type     : "form",
        icon     : "form",
        name     : json.props.id,
        path     : json.props.component_path,
        project  : project,
        controls : json.children,
        parent   : parent,
        json     : json
    } );
}

function addMetadataToItem(
            project : string,
            path    : string,
            cmp     : string,
            children: any[]) : void{

    if(!children) return;
    
    for (let i = 0; i < children.length; i++) {

        const element     = children[i];
        element.project   = project;
        element.path      = path;
        element.component = cmp;
        element.name      = element.props.id;
        element.type      = "field";
        element.icon      = `controls/${element.controlType}`;

        addMetadataToItem(project,path,cmp, element.children);
        
    }
}