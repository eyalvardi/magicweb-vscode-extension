import * as vscode from 'vscode';
import { MagicItem } from '../magicTreeItem';


export class ShowPreviewCommand {
    command: string = "markdown.showPreview";
    arguments: any[] = [];
    get title(){ return this.item.name; }

    constructor(public item: MagicItem) {
        const uri = vscode.Uri.parse(`magic://items/${this.item.name}#${JSON.stringify(item)}`);
        this.arguments.push(uri);
    }
}