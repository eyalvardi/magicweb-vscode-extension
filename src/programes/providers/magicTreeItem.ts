import * as vscode from 'vscode';
import * as path from 'path';
import { ShowPreviewCommand } from '../commands/ShowPreviewCommand';
import { createOpenCmpHtmlCommand } from '../commands/openHtmlCmp.command';
import { TreeItemCollapsibleState } from 'vscode';

let counter = 0;

export function setProjectToItems(project:string,items:any[]) : any[] {
	return items.map( item => {
		item.project = project;
		return item;
	} )
}

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
	get icon(): string{
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
	get project(){ return this.mgTreeItem.project; }

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
		this.setCommand();
		
	}
	get tooltip(): string {
		return `${this.type} - ${this.label}`;
	}
	get iconPath(){
		let icon = this.icon as string;
		if(this.type === "field" && this.isGenerate){
			icon = `${icon}-gen`;
		} else if (this.type === "program" && this.mgTreeItem.isBootstrap) {
			icon = `${icon}-start`;
		} else if (this.type === "folder" && this.collapsibleState === TreeItemCollapsibleState.Expanded){
			icon = `${icon}-open`;
		}

		return {
				light: path.join(baseIconPath, 'light', `${icon}.svg`),
				dark : path.join(baseIconPath, 'dark', `${icon}.svg`)
		};
	}

	setCommand() : void {
		switch (this.type) {
			case "folder":
				this.command = new ShowPreviewCommand(this);
				break;
		
			case "form":
				this.command = createOpenCmpHtmlCommand(this);
				break;

			case "field":
				this.command = createOpenCmpHtmlCommand(this);
				break;

			default:
				this.command = new ShowPreviewCommand(this);
				break;
		}
	}
}

const baseIconPath =  path.join(__filename, '../../../../', 'resources');