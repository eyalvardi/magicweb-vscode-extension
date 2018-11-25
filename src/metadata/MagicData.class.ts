import { MagicItem } from '../programes/providers/MagicTreeItem.class';
import { loadMetadata } from './loadJson';
import { TreeItemCollapsibleState } from 'vscode';



export class MagicData {
    
    get tree () { return this.treeItem.children; }
    isMagicProject : boolean = false;
    projectName : string;
    icon        : string = "rootFolder";
    treeItem    : MagicItem;
    
    folders     = new Map<number | string ,MagicTreeItem>();
    programs    = new Map<number | string ,MagicTreeItem>();
    tasks       = new Map<number | string ,MagicTreeItem>();
    forms       = new Map<string ,MagicTreeItem>();

    constructor( projectName:string , json:MagicTreeItem[] = [] ) {
        this.projectName = projectName;
        this.treeItem = new MagicItem({
                    id 		 : "",
					type	 : "folder",
					icon     : "rootFolder",
					name 	 : projectName,
					project  : projectName
        });
        this.treeItem.collapsibleState = TreeItemCollapsibleState.Collapsed;
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
            this.treeItem.mgTreeItem.children = await loadMetadata(this.projectName,path, this.treeItem);
        } catch (error) {
            this.treeItem.mgTreeItem.children = [];           
        }     
     
        this.isMagicProject = this.tree.length === 0 ? false : true;
        this.proccessJson(this.tree);
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
                    this.forms.set(`${item.path}${item.name}`,item);
                    break;
            }
            if(item.children && item.children.length > 0){
                this.proccessJson(item.children);          
            }            
        });       
    }
}
