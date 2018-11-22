import * as vscode from 'vscode';
import { MagicItem } from './magicTreeItem';
import { MagicEnv } from '../../env';
import { MagicData } from '../magic.data';

export class MagicTreeDataProvider implements vscode.TreeDataProvider<MagicTreeItem> {

	private _onDidChangeTreeData   = new vscode.EventEmitter<MagicTreeItem | undefined>();
	readonly onDidChangeTreeData   = this._onDidChangeTreeData.event;

	constructor(
			//private workspaceRoot: string | undefined,
			private magicEnv: MagicEnv
		) {
			this.refresh();			
		}

	refresh(magicTreeItem?: MagicTreeItem): void {				
		//await this.magicEnv.refresh();
		if (magicTreeItem) {
			this._onDidChangeTreeData.fire(magicTreeItem);
		} else {
			this._onDidChangeTreeData.fire();
		}
	}

	getTreeItem( item: MagicTreeItem ) : vscode.TreeItem {
		if(item instanceof MagicData){
			return new MagicItem({
					id 		 : "",
					type	 : "folder",
					icon     : "rootFolder",
					name 	 : item.projectName,
					children : item.tree,
					project  : item.projectName
				});

		} else if(item.type === "field"){
			if((<any>item).props){	// Field Item			
				item.icon = item.icon || "field";
			};						
		}
		return new MagicItem(item);
    }

	async getChildren(element?: MagicItem ) {
		let result:any[] = [];
		if(element instanceof MagicItem){
			if (element && MagicItem.isChildren(element as MagicTreeItem)){
				if( element.children && element.children.length > 0){ 
					result = element.children; 
				} else if (element.controls && element.controls.length > 0 ) {
					result = element.controls;	
				}
			} 
		}
		else if( element && (element as any) instanceof MagicData){			
			result = (<MagicData><any>element).tree;
		}
		else if(element && (element as any).children){
			result = (<any>element).children;
		}
		else if(element && (element as any).type === "form" && (element as any).controls){
			result = (<any>element).controls;
		}
		else {
			result = this.getMagicProjects();
		}

		if(element){ 
			
			(<any>element).size = result.length;

			result.forEach( item => {
				item.parent = element;
			})
		}

		return result;
	}

	getParent(element: MagicTreeItem): MagicTreeItem{
		return element.parent as MagicTreeItem;
	}

	getMagicProjects() : MagicData[] {
		const projects = Array.from( this.magicEnv.projects.values() );

		const mgProject = projects.map( prj => prj.magic);
						   
		const magicWithMetadata = mgProject.filter( mgp => mgp.isMagicProject ) as MagicData[];

		return magicWithMetadata;
	}
	
}


