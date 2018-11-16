import * as vscode from 'vscode';
//import * as path from 'path';
import { MagicData } from './fetach.programs';
import { MagicItem } from './magicTreeItem';

export class ProgramsTreeDataProvider implements vscode.TreeDataProvider<MagicTreeItem> {

	private _onDidChangeTreeData   : vscode.EventEmitter<MagicTreeItem | undefined> = new vscode.EventEmitter<MagicTreeItem | undefined>();
	readonly onDidChangeTreeData   : vscode.Event<MagicTreeItem | undefined>        = this._onDidChangeTreeData.event;

	constructor(
			//private workspaceRoot: string | undefined,
			private magicData:MagicData			
		) {
			this.refresh();
		}

	async refresh(): Promise<void> {		
		await this.magicData.loadJson();
		this._onDidChangeTreeData.fire();
	}

	getTreeItem( item: MagicTreeItem ) : vscode.TreeItem {
		// if( item.type === "folder" && item.children && item.children.length === 1){
		// 	item = item.children[0];
		// }
		return new MagicItem(item);
    }

	getChildren(element?: MagicItem) {
		if (element && MagicItem.isChildren(element as MagicTreeItem)){
			if( element.children && element.children.length > 0){ 
				return element.children; 
			} else if (element.controls && element.controls.length > 0 ) {
				return element.controls;	
			}
		}
		return this.magicData.getPrograms() as MagicTreeItem[];		
	}
	
}


