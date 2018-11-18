import * as vscode from 'vscode';
import { MagicItem } from '../providers/magicTreeItem';


export class ShowPreviewCommand {
    command    : string = "markdown.showPreview";
    arguments  : any[]  = [];
    languageId : string = "markdown";
    get title(){ return `${this.item.name}.md`; }

    constructor(public item: MagicItem) {
        const uri = vscode.Uri.parse(`magic://items/${this.item.name}.md#${JSON.stringify(item)}`);
        this.arguments.push(uri);
    }
}