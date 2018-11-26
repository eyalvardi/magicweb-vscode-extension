import * as path    from 'path';

import { Utils } from "../schematics/utils";
import { env } from "../programes/magic.extension";
import { MagicData } from './MagicData.class';


export async function loadConfig(path:string){
    return await Utils.readDirAsync( path );
}

export async function writeConfig(path:string, config : MagicConfig){
    return await Utils.writeFileAsync(path,config);
}

export class MagicConfig {

    data: IMagicConfig = {
        create_route_map    : false,
        create_new_project  : false,
        created_menu        : false,
        created_views       : false,    
        absolute_position   : false,
        backup_current      : false,
        copy_images         : false,    
        allow_testing       : false, 
        exposed_functionality:false,   
        
        source_images_folder: "",
        theme               : "",
        output_folder       : "",
        project_name        : "",

        form_files          : [],
    }

    componentsToGen = new Set<string>();


    async loadConfig(path:string)  : Promise<IMagicConfig> {
        const configStr = await Utils.readFileAsync( path );
        const config : IMagicConfig = JSON.parse(configStr);
        this.componentsToGen.clear();
        config.form_files.forEach( c => this.componentsToGen.add(c) );
        
        return Object.assign(this.data, config);        
    }

    async writeConfig(path:string, config : IMagicConfig) : Promise<void> {
        return await Utils.writeFileAsync(path,config);
    }


    addItemsToGenerate( folder : any) : void {
        
        folder = folder.children != null ? folder.children : (<MagicData>folder).treeItem.children
        
        const items = this.getComponentsByFolder(folder);       

        items.forEach( i => this.componentsToGen.add(`${i.path}${i.name}`) );

        this.data.form_files = Array.from(this.componentsToGen);

        this.writeConfig( path.join(env.metadataPath,'config.json'), this.data)
    }


    getComponentsByFolder(treeItems:MagicTreeItem[]) : MagicTreeItem []{
        const result : MagicTreeItem[] = [];

        treeItems.forEach( item => {
            switch (item.type) {

                case "form":
                    result.push(item);
                    break;                    

                case "field":                    
                    break;

                default:
                    if(item.children)
                        result.splice(0,0,...this.getComponentsByFolder(item.children) );
                    break;
            }           
        });
        return result;
    }

    generateControl(controlName:string ) {
        
    }
}