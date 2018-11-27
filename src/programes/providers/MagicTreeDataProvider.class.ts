import * as vscode from 'vscode';
import { MagicItem } from './MagicTreeItem.class';
import { MagicEnv } from '../../metadata/env';
import { MagicData } from '../../metadata/MagicData.class';
import { TreeItemCollapsibleState } from 'vscode';

export class MagicTreeDataProvider implements vscode.TreeDataProvider<MagicTreeItem> {

	private _onDidChangeTreeData   = new vscode.EventEmitter<MagicTreeItem | undefined>();
	readonly onDidChangeTreeData   = this._onDidChangeTreeData.event;

	constructor(
			//private workspaceRoot: string | undefined,
			private magicEnv: MagicEnv
		) {
			this.refresh();			
		}

	async refresh(magicTreeItem?: MagicTreeItem): Promise<void> {				
		await this.magicEnv.refresh();
		if (magicTreeItem) {
			this._onDidChangeTreeData.fire(magicTreeItem);
		} else {
			this._onDidChangeTreeData.fire();
		}
	}
	collapse(treeItem : MagicItem){
		if(treeItem){
			this.setCollapsibleState(treeItem,TreeItemCollapsibleState.Collapsed);		
		} else {
			this.magicEnv.magicProjects.forEach( prj => {
				this.collapse( prj.treeItem );
			});
		}
		this._onDidChangeTreeData.fire();
	}
	expand(treeItem : MagicItem){
		if(treeItem){
			this.setCollapsibleState(treeItem,TreeItemCollapsibleState.Expanded);		
		} else {
			this.magicEnv.magicProjects.forEach( prj => {
				this.expand( prj.treeItem );
			});
		}
		this._onDidChangeTreeData.fire();
	}

	setCollapsibleState(treeItem : MagicItem, state : TreeItemCollapsibleState) : void {
		const stateToReplace = treeItem.collapsibleState === TreeItemCollapsibleState.Collapsed ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed;
		(<any>treeItem).id   = `${treeItem.id.substring(0,treeItem.id.length-2)}${stateToReplace}-`;     // treeItem.id.replace(`-${treeItem.collapsibleState}-`,`-${stateToReplace}-`)
		treeItem.collapsibleState = state;
		
		//treeItem.id = treeItem.id+1 
		const children = treeItem.children ? treeItem.children : (<MagicData><any>treeItem).tree
		if( children) {
			children.forEach( child => {
				this.setCollapsibleState(child as MagicItem,state);
			});
		}
	}

	getTreeItem( item: MagicTreeItem ) : vscode.TreeItem {

		let treeItem : MagicItem;

		// Root Folder for Magic Project
		if(item instanceof MagicData){
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
			if (element && MagicItem.isChildren(element as MagicTreeItem) === 1){
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


