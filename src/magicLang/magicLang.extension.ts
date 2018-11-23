import { 
    TextDocument, 
    Position, 
    CancellationToken,    
    ExtensionContext, 
    languages, 
    CompletionItem, 
    CompletionItemProvider, 
    Memento, 
    window, 
    CompletionItemKind
} from 'vscode';
import { env, magicTreeView } from '../programes/magic.extension';
import { MagicItem } from '../programes/providers/magicTreeItem';

class MagicCompletionItemProvider implements CompletionItemProvider {

    controls: {path:string , items:CompletionItem[]} = {path:"",items:[]};

    constructor(public globalState?: Memento) {
    }

    async  provideCompletionItems(
        document : TextDocument, 
        position : Position, 
        token    : CancellationToken,
        context  : any ): Promise<CompletionItem[]> {

            console.log(`pos : ${position}`);
            let result;

            if(document.fileName != this.controls.path) {
                const controls = getControlsFromPath(document.fileName,context);

                result = controls.map( name => {
                    var item:CompletionItem = new CompletionItem(name,CompletionItemKind.Value);
                    item.detail = `control name ${name}`;                
                    item.filterText = name;
                    item.insertText = name;
                    return item;
                });
            
                this.controls = { path: document.fileName, items: result };
            } else {
                result = this.controls.items;
            }

            return result;
    }
}

export function magicCompletionInHtmlActivate(ctx: ExtensionContext): void {    

    // Completion
    ctx.subscriptions.push(
        languages.registerCompletionItemProvider(
           [ 
               //{ language: "html" , scheme: "http"} , 
               { language: "html" , scheme: "file"  /* , pattern: '*.mg.html' */ } 
            ],
             new MagicCompletionItemProvider() ,
             'magic=' 
        ) 
    );
    
    window.onDidChangeActiveTextEditor( e => {
        //arg.document.fileName
        if(!e) return;
        const mgForm = getMagicFormByPath(e.document.fileName);
        magicTreeView.reveal(mgForm);

    })


    // Diagnostic
    //diagnosticCollection = languages.createDiagnosticCollection('magic');
    //ctx.subscriptions.push(diagnosticCollection);
   
}

function getMagicFormByPath(path:string) : MagicItem {
     //TODO : REGX
     let indexMagic = path.indexOf('\\src\\app\\magic\\');
     let leftPath   = path.substring(indexMagic,path.length - '.component.html'.length);
     let folderPath = leftPath.substring('\\src\\app\\magic\\'.length);
 
     folderPath = folderPath.replace(/\\/g,'/');
 
     let formsMaps = Array.from ( env.projects.values() )
                             .map   ( prj => prj.magic )
                             .filter( prj => prj.isMagicProject )
                             .map   ( prj => prj.forms );
 
     return formsMaps.map( f => f.get(folderPath) )[0] as MagicItem; 
}
export function getControlsFromPath(path:string,context  : any) : string[] {
    let result : string[]  = [];    

    let formsMagicData = getMagicFormByPath(path);

    if(formsMagicData){
        result = formsMagicData.controlsList
    }                    
    
    return result;

}
