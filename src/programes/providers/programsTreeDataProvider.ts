import * as vscode from 'vscode';
//import * as path from 'path';
import { MagicData } from '../magic.data';
import { MagicItem } from './magicTreeItem';

export class MagicTreeDataProvider implements vscode.TreeDataProvider<MagicTreeItem> {

	private _onDidChangeTreeData   = new vscode.EventEmitter<MagicTreeItem | undefined>();
	readonly onDidChangeTreeData   = this._onDidChangeTreeData.event;

	constructor(
			//private workspaceRoot: string | undefined,
			private magicData:MagicData			
		) {
			this.refresh();			
		}

	async refresh(magicTreeItem?: MagicTreeItem): Promise<void> {		
		await this.magicData.loadJson();
		if (magicTreeItem) {
			this._onDidChangeTreeData.fire(magicTreeItem);
		} else {
			this._onDidChangeTreeData.fire();
		}
	}

	getTreeItem( item: MagicTreeItem ) : vscode.TreeItem {
		if(!item.name){
			item.name = (<any>item).props.id;
			item.type = "field";
			item.icon = "field";			
		}
		return new MagicItem(item);
    }

	async getChildren(element?: MagicItem) {
		let result:any[] = [];
		if (element && MagicItem.isChildren(element as MagicTreeItem)){
			if( element.children && element.children.length > 0){ 
				result = element.children; 
			} else if (element.controls && element.controls.length > 0 ) {
				result = element.controls;	
			}
		} else {
			result = await this.magicData.tree;
		}

		if(element){ element.size = result.length;}

		return result;
	}
	
}


