import * as vscode from 'vscode';
import * as path from 'path';
import { ShowPreviewCommand } from './commands/ShowPreviewCommand';

let counter = 0;

export class MagicItem extends vscode.TreeItem implements MagicTreeItem{

	get id() : string {
		return super.id || "-1";
	}
	get type(): MagicTypeItem{
		return this.mgTreeItem.type;
	}
	get name(): string{
		return this.mgTreeItem.name;
	}
	get icon(): MagicTypeItem{
		return this.mgTreeItem.icon || "folder";
	}
	get path(): string{
		return this.mgTreeItem.path || "";
	}
	get isGenerate(): boolean {
		return this.mgTreeItem.isGenerate || false;
	}
	get children(): MagicTreeItem[] {
		return this.mgTreeItem.children || [];
	}
	get component(): MagicComponentTreeItem | undefined {
		return this.mgTreeItem.component;
	}
	get controls(): MagicTreeItem[] {
		return this.mgTreeItem.controls || [];
	}

	static isChildren(item: MagicTreeItem){
		return ( item.children && item.children.length > 0 ) || 
			   ( item.controls && item.controls.length > 0 );				
	}

	constructor( public mgTreeItem: MagicTreeItem ) {
		
		super( mgTreeItem.name, 
		       MagicItem.isChildren(mgTreeItem) ?  
						   vscode.TreeItemCollapsibleState.Collapsed :  
						   vscode.TreeItemCollapsibleState.None
			);
		super.id = `${counter++}`;
		this.command = new ShowPreviewCommand(this);	

	}
	get tooltip(): string {
		return `${this.type} - ${this.label}`;
	}
	get iconPath(){
		return {
				light: path.join(baseIconPath, 'light', `${this.icon}.svg`),
				dark : path.join(baseIconPath, 'dark', `${this.icon}.svg`)
		};
	}
	contextValue = 'dependency';
}

const baseIconPath =  path.join(__filename, '..', '..', '..', 'resources');