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

	async refresh(offset?: number): Promise<void> {		
		await this.magicData.loadJson();
		if (offset) {
			this._onDidChangeTreeData.fire(offset as any);
		} else {
			this._onDidChangeTreeData.fire();
		}
	}

	getTreeItem( item: MagicTreeItem ) : vscode.TreeItem {
		// if( item.type === "folder" && item.children && item.children.length === 1){
		// 	item = item.children[0];
		// }
		// if( item.size && item.size > 0){
		// 	item.name =  `${item.name} (${item.size})`;
		// }
		return new MagicItem(item);
    }

	getChildren(element?: MagicItem) {
		let result:any[] = [];
		if (element && MagicItem.isChildren(element as MagicTreeItem)){
			if( element.children && element.children.length > 0){ 
				result = element.children; 
			} else if (element.controls && element.controls.length > 0 ) {
				result = element.controls;	
			}
		} else {
			result = this.magicData.getPrograms() as MagicTreeItem[];
		}

		if(element){ element.size = result.length;}

		return result;
	}
	
}


