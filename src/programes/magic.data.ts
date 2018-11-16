import * as vscode  from 'vscode';
import { Utils } from "../schematics/utils";
import * as path    from 'path';
//import * as childProcess from 'child_process';
//import * as os      from 'os';
import * as JSON5   from 'json5';
//import fetch from 'node-fetch';
//import * as res from './programs.json';

export async function fetchPrograms() : Promise<MagicTreeItem[]>{
    const filePath = path.join(vscode.workspace.rootPath || "","magic-metadata/magic.config.json");
    console.log(`magic-metadata: ${filePath}`);

    const str  = await Utils.readFileAsync(filePath);
    //const json = await res.json();
    return JSON5.parse(str);  
}

export class MagicData {
    tree : MagicTreeItem [] = [];
    folders     = new Map<number | string ,MagicTreeItem>();
    programs    = new Map<number | string ,MagicTreeItem>();
    tasks       = new Map<number | string ,MagicTreeItem>();
    forms       = new Map<number | string ,MagicTreeItem>();

    constructor( json:MagicTreeItem[] = [] ) {
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

    async loadJson(){
      const json = await fetchPrograms();
      this.proccessJson(json);
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