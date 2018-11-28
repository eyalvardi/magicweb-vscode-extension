import {   
    ExtensionContext, 
    languages,   
    DiagnosticCollection,
    Range,
    TextEditor,
    window,
    Diagnostic,
    Uri,
    DiagnosticSeverity,
    commands,
    workspace
} from 'vscode';
import { env } from '../programes/magic.extension';


let diagnosticCollection: DiagnosticCollection;


export function magicDiagnosticActivate(ctx: ExtensionContext): void {
    diagnosticCollection = languages.createDiagnosticCollection('magic')
    // Diagnostic
    ctx.subscriptions.push(diagnosticCollection);

    //magic.checkHtmlErrors
    ctx.subscriptions.push( 
        commands.registerCommand('magic.checkHtmlErrors', 
            () => {
                const editor = window.activeTextEditor as TextEditor;
                
                if( !editor ) return;
                
                const controlNames = env.getControlsFromPath(editor.document.fileName,ctx);
                checkDiagnostics(editor.document.uri, controlNames);
            }
        )
    );
    ctx.subscriptions.push( 
            workspace.onDidSaveTextDocument( document => {
                if( !document ) return;
                if ( env.isMagicComponent( document.fileName ) ) {
                    commands.executeCommand('magic.checkHtmlErrors');
                }        
            })
    );        

}

export function checkDiagnostics(uri:Uri,controlNames:string[]): DiagnosticCollection{
    if(window.activeTextEditor){
        let editor = window.activeTextEditor;
        
        diagnosticCollection.clear();

        const html = editor.document.getText();
        let regexp =  /magic="?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/mg;     /// version 1/magic="(.*)"/mg;
        let results = [];
        let r;

        while (r = regexp.exec(html)) {
            results.push(r);
        }

        let errors :string[] = [];
        results.forEach( r => {           
            let ctl = r[1];
            if( controlNames.filter( c => c == ctl).length == 0 ){
                errors.push(ctl);
            }                      
        });

        setDiagnosticError(uri,errors,html,editor);
    }
    return diagnosticCollection;
}

function setDiagnosticError(uri:Uri,controls:string[],html:string,editor:TextEditor){
    const dgs :Diagnostic[] = [];
    controls.forEach(control => {
        let rang = findControlRange(control,html,editor);
        if( rang ) {
           dgs.push(new Diagnostic(rang,`${control} - Not Magic control name.`, DiagnosticSeverity.Error));
         } 
    })
    
    diagnosticCollection.set(uri, dgs);       
}


function findControlRange(control:string,html:string,editor:TextEditor) : Range | undefined {   
    
    const pos  = html.indexOf(`magic="${control}"`);
       
    if(pos === -1) return;

    const range:Range = new Range(
            editor.document.positionAt(pos),
            editor.document.positionAt(pos+`magic="${control}"`.length)
    );

    return range;
            
}



/* 
export function getDisposable(){}

function onChange() {
    let uri = document.uri;

    check(uri.fsPath, goConfig).then(
        errors => {

      diagnosticCollection.clear();

      let diagnosticMap = new Map<string, Diagnostic[]>();
      errors.forEach( (error:any) => {
        
        let canonicalFile = Uri.file(error.file).toString();
        let range = new Range(error.line-1, error.startColumn, error.line-1, error.endColumn);
        let diagnostics = diagnosticMap.get(canonicalFile);
        
        if (!diagnostics) { diagnostics = []; }
        
        diagnostics.push(new Diagnostic(range, error.msg, error.severity));
        diagnosticMap.set(canonicalFile, diagnostics);
      });
      diagnosticMap.forEach((diags, file) => {
        diagnosticCollection.set(Uri.parse(file), diags);
      });

    });
  } 
  */