import * as vscode from 'vscode';
import * as path from 'path';
import { ShowPreviewCommand } from '../commands/ShowPreviewCommand';

let counter = 0;

export class MagicItem extends vscode.TreeItem implements MagicTreeItem{

	size? : number; 

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
	get contextValue(){
		return this.mgTreeItem.type;
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
		let icon = this.icon as string;
		if(this.type === "field" && this.isGenerate){
			icon = `${icon}-gen`;
		}
		return {
				light: path.join(baseIconPath, 'light', `${icon}.svg`),
				dark : path.join(baseIconPath, 'dark', `${icon}.svg`)
		};
	}
}

const baseIconPath =  path.join(__filename, '../../../../', 'resources');