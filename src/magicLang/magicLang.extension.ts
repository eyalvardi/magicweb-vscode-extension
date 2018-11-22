import { TextDocument, Position, CancellationToken, Hover, DocumentFilter, HoverProvider, ExtensionContext, languages, CompletionContext, ProviderResult, CompletionItem, CompletionList, CompletionItemProvider, Diagnostic, Uri, Range, Memento, DiagnosticCollection, TextEditor, window } from 'vscode';
import { env, magicTreeView } from '../programes/magic.extension';
import { MagicItem } from '../programes/providers/magicTreeItem';

const MAGIC_MODE: DocumentFilter = { language: "html", scheme: 'file' /* , pattern: '*.mg.html' */ };


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
                    var item:CompletionItem = new CompletionItem("id");
                    item.detail = `control name ${name}`;                
                    item.filterText = name;
                    item.insertText = name;
                    item.label      = name;
                    return item;
                });
            
                this.controls = { path: document.fileName, items: result };
            } else {
                result = this.controls.items;
            }

            return result;
    }
}

let diagnosticCollection: DiagnosticCollection;

export function magicLanguageActivate(ctx: ExtensionContext): void {    

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
function getControlsFromPath(path:string,context  : any) : string[] {
    let result : string[]  = [];    

    let formsMagicData = getMagicFormByPath(path);

    if(formsMagicData){
        result = formsMagicData.controlsList
    }                    
    
    return result;

}

function checkMagicHtml(path:string) {

}


// export function getDisposable(){}

// function onChange() {
//     let uri = document.uri;

//     check(uri.fsPath, goConfig).then(
//         errors => {

//       diagnosticCollection.clear();

//       let diagnosticMap = new Map<string, Diagnostic[]>();
//       errors.forEach( (error:any) => {
        
//         let canonicalFile = Uri.file(error.file).toString();
//         let range = new Range(error.line-1, error.startColumn, error.line-1, error.endColumn);
//         let diagnostics = diagnosticMap.get(canonicalFile);
        
//         if (!diagnostics) { diagnostics = []; }
        
//         diagnostics.push(new Diagnostic(range, error.msg, error.severity));
//         diagnosticMap.set(canonicalFile, diagnostics);
//       });
//       diagnosticMap.forEach((diags, file) => {
//         diagnosticCollection.set(Uri.parse(file), diags);
//       });

//     });
//   }
