import * as vscode from 'vscode';
import * as path from 'path';

export class MagicProgram extends vscode.TreeItem {
	constructor(public readonly label: string, private version: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState, public readonly command?: vscode.Command) {
		super(label, collapsibleState);
	}
	get tooltip(): string {
		return `${this.label}-${this.version}`;
	}
	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'dependency.svg')
	};
	contextValue = 'dependency';
}