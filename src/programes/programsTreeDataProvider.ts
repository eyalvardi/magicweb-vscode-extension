import * as vscode from 'vscode';
import { MagicData } from './fetach.programs';

export class ProgramsTreeDataProvider implements vscode.TreeDataProvider<MagicTreeItem> {

	private _onDidChangeTreeData   : vscode.EventEmitter<MagicTreeItem | undefined> = new vscode.EventEmitter<MagicTreeItem | undefined>();
	readonly onDidChangeTreeData   : vscode.Event<MagicTreeItem | undefined>        = this._onDidChangeTreeData.event;

	constructor(
			private workspaceRoot: string | undefined,
			private magicData:MagicData			
		) {}

	refresh(): void {
		this._onDidChangeTreeData.fire();
		this.magicData.loadJson();
	}

	getTreeItem( item: MagicTreeItem ) : vscode.TreeItem{
        return {
            label : item.name
        };
    }

	getChildren(element?: MagicTreeItem) {
		return this.magicData.getPrograms() as MagicTreeItem[];
		
	}

	
}


