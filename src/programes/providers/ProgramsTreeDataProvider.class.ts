import * as vscode from 'vscode';
import { MagicItem } from './MagicTreeItem.class';
import { MagicEnv } from '../../metadata/env';
import { MagicData } from '../../metadata/MagicData.class';

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
		await this.magicEnv.refresh();
		if (magicTreeItem) {
			this._onDidChangeTreeData.fire(magicTreeItem);
		} else {
			this._onDidChangeTreeData.fire();
		}
	}

	getTreeItem( item: MagicTreeItem ) : vscode.TreeItem {

		let treeItem : MagicItem;

		// Root Folder for Magic Project
		if(item instanceof MagicData){
			// treeItem = new MagicItem({
			// 		id 		 : "",
			// 		type	 : "folder",
			// 		icon     : "rootFolder",
			// 		name 	 : item.projectName,
			// 		children : item.tree,
			// 		project  : item.projectName
			// 	});
			// item.treeItem = treeItem;
			treeItem = item.treeItem;
		} 
		// Program | Task | Form | Folder cases for Tree Item
		else if( item instanceof MagicItem) {
			treeItem = item;
		}
		else {
			treeItem = new MagicItem(item);
		}		

		return treeItem;
    }

	async getChildren(element?: MagicItem ) {
		let result:any[] = [];
		// MagicItem
		if(element instanceof MagicItem){
			if (element && MagicItem.isChildren(element as MagicTreeItem)){
				if( element.children && element.children.length > 0){ 
					result = element.children; 
				} else if (element.controls && element.controls.length > 0 ) {
					result = element.controls;	
				}
			} 
		}
		// MagicData (Root Project)
		else if( element && (element as any) instanceof MagicData){			
			result = (<MagicData><any>element).tree;
		}
		// MagicTreeItem interface with children
		else if(element && (element as any).children){
			result = (<any>element).children;
		}
		// Magic Form
		else if(element && (element as any).type === "form" && (element as any).controls){
			result = (<any>element).controls;
		}
		// Root Tree
		else {
			result = this.magicEnv.magicProjects;
		}

		if(element){ 
			
			(<any>element).size = result.length;
			// Set parent for each child
			result.forEach( item => {
				item.parent = element;
			})
		}

		return result;
	}

	getParent(element: MagicTreeItem){
		if(!element.project) return;
		return element.parent;
	}
}


