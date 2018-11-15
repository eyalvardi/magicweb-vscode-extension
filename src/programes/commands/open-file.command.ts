import * as vscode from 'vscode';

export class OpenFileCommand {
    
    arguments : any[] = [];

    constructor(public id:string,public path: string){
        const uri = vscode.Uri.parse(`magic://component/${this.path}`);
        this.arguments.push(uri);
    }

}

