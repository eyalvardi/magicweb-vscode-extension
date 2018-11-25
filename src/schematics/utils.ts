import * as vscode  from 'vscode';
import * as fs      from 'fs';
import * as util    from 'util';
import * as path    from 'path';
import * as childProcess from 'child_process';
import * as os      from 'os';
import * as JSON5   from 'json5';


const osList = new Map<string, string>();
osList.set('darwin', 'osx');
osList.set('win32', 'windows');

const userOs = osList.get(os.platform()) || 'linux';

// TODO: Manage custom shell for Windows
const userShell = (userOs === 'windows') ? undefined : vscode.workspace.getConfiguration().get(`terminal.integrated.shell.${userOs}`) as string;

export class Utils {

    static normalizePath(path: string): string {

        /* Normalize Windows path into Linux format */
        return path.replace(/\\\\/, '/');

    }

    static pathTrimRelative(path: string): string {

        return path.replace('./', '');

    }

    static getDirectoryFromFilename(filename: string): string {

        return filename.replace(/[^\/]*$/, '');

    }

    static getSchemaFromNodeModules<T = any>(cwd: string, packageName: string, filePath: string): Promise<T | null> {

        return this.parseJSONFile<T>(this.getNodeModulesPath(cwd, packageName, filePath));

    }

    static getNodeModulesPath(cwd: string, ...paths: string[]) {

        return path.join(cwd, 'node_modules', ...paths);

    }

    static writeFileAsync(path: string, obj: any): Promise<void> {
        const writeFile = util.promisify( fs.writeFile);
        return writeFile(path,JSON.stringify(obj));
    }

    /** @todo Replace with utils.promisify() when Electron / VS Code is updated to Node 8 */
    static readFileAsync(path: string): Promise<string> {

        return new Promise((resolve, reject) => {
    
            fs.readFile(path, 'utf8', (error, data) => {
    
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
    
            });
    
        });
    
    }

    static readDirAsync(path:string) : Promise<string[]> {
        const readDir = util.promisify( fs.readdir);
        return readDir(path);        
    }

    static readStatsAsync(path:string) : Promise<fs.Stats> {
        const readStat = util.promisify( fs.stat);
        return readStat(path);        
    }

    static exists(path:string) : Promise<boolean> {
        const exists = util.promisify( fs.exists);
        return exists(path);        
    }

    /** @todo Replace with utils.promisify() when Electron / VS Code is updated to Node 8 */
    static existsAsync(path: string): Promise<boolean> {

        return new Promise((resolve) => {
    
            fs.exists(path, (exists) => {
    
                resolve(exists);
    
            });
    
        });
    
    }

    /** @todo Replace with utils.promisify() when Electron / VS Code is updated to Node 8 */
    static execAsync(command: string, cwd?: string): Promise<string> {

        return new Promise((resolve, reject) => {
    
            childProcess.exec(command, { cwd, shell: userShell }, (error, stdout, stderr) => {
    
                if (error) {
                    reject([stdout, stderr]);
                } else {
                    resolve(stdout);
                }
    
            });
    
        });
    
    }

    static async parseJSONFile<T = any>(path: string): Promise<T | null> {

        let json: T | null = null;
    
        try {            
            const data = await this.readFileAsync(path);    
            json = JSON5.parse(data) as T;
    
        } catch (error) {}    
        return json;    
    }

}