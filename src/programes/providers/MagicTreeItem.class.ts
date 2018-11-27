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
	controlsList: string [] = [];
	_parent: MagicItem | MagicTreeItem | undefined; 

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

	
	get parent(){ return this._parent || this.mgTreeItem.parent; }
	set parent(val) { this._parent = val; } 
	
	static isChildren(item: MagicTreeItem) : TreeItemCollapsibleState{
		return ( item.children && item.children.length > 0 ) || 
			   ( item.controls && item.controls.length > 0 ) ? 
				   TreeItemCollapsibleState.Collapsed : 
				   TreeItemCollapsibleState.None;				
	}

	constructor( public mgTreeItem: MagicTreeItem ) {
		
		super( mgTreeItem.name, MagicItem.isChildren(mgTreeItem) );
		super.id     = `${counter++}-${MagicItem.isChildren(mgTreeItem)}-`;//`${mgTreeItem.path}-${mgTreeItem.type}-${mgTreeItem.name}`;
		this._parent = mgTreeItem.parent;
		this.setCommand();

		if(this.type === "form") {
			this.buildControlsList(this.controls,this.controlsList);
		}
		
	}
	get tooltip(): string {
		return `${this.type.toUpperCase()}: ${this.label} , id:${this.id}`;
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
				dark : path.join(baseIconPath, 'dark' , `${icon}.svg`)
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

	buildControlsList( items:MagicTreeItem[] , controls:string[]) : void {
		
		if(items.length === 0) return;

		items.forEach( element => {
			controls.push( element.name );
			this.buildControlsList( element.children || [], controls )
		});
	}
}

const baseIconPath =  path.join(__filename, '../../../../', 'resources');