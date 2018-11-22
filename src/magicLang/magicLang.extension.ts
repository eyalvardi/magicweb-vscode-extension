import { TextDocument, Position, CancellationToken, Hover, DocumentFilter, HoverProvider, ExtensionContext, languages, CompletionContext, ProviderResult, CompletionItem, CompletionList, CompletionItemProvider, Diagnostic, Uri, Range, Memento, DiagnosticCollection } from 'vscode';
import { env } from '../programes/magic.extension';
import { MagicItem } from '../programes/providers/magicTreeItem';

const MAGIC_MODE: DocumentFilter = { language: "html", scheme: 'file' /* , pattern: '*.mg.html' */ };


class MagicCompletionItemProvider implements CompletionItemProvider {

    constructor(public globalState?: Memento) {
    }
    
    getControlsFromPath(path:string,context  : any) : string[] {
        let result : string[]  = [];
        //TODO : REGX
        let indexMagic = path.indexOf('\\src\\app\\magic\\');
        let leftPath   = path.substring(indexMagic,path.length - '.component.mg.html'.length);
        let folderPath = leftPath.substring('\\src\\app\\magic\\'.length);

        folderPath = folderPath.replace(/\\/g,'/');

        let formsMaps = Array.from ( env.projects.values() )
                                .map   ( prj => prj.magic )
                                .filter( prj => prj.isMagicProject )
                                .map   ( prj => prj.forms );

        let formsMagicData = formsMaps
                                .map( f => f.get(folderPath) )
                               // .filter( item => item != null);

        if(formsMagicData && formsMagicData.length > 0){
            const form = formsMagicData[0] as MagicItem;
            result = form.controlsList
        }                        
                                
        
        return result;

    }


    async  provideCompletionItems(
        document : TextDocument, 
        position : Position, 
        token    : CancellationToken,
        context  : any ): Promise<CompletionItem[]> {

            console.log(`pos : ${position}`);
            const controls = this.getControlsFromPath(document.fileName,context);

            let result = controls.map( name => {
                var item:CompletionItem = new CompletionItem("id");
                item.detail = `control name ${name}`;                
                item.filterText = name;
                item.insertText = name;
                item.label      = name;
                return item;
            });
            

            return result;
    }
}

let diagnosticCollection: DiagnosticCollection;

export function magiclanguageActivate(ctx: ExtensionContext): void {    

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
    
    // Diagnostic
    //diagnosticCollection = languages.createDiagnosticCollection('magic');
    //ctx.subscriptions.push(diagnosticCollection);
   
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
