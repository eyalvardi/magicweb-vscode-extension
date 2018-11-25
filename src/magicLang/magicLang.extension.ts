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
    CompletionItemKind,
    TextEditor
} from 'vscode';
import { env, magicTreeView } from '../programes/magic.extension';

class MagicCompletionItemProvider implements CompletionItemProvider {

    controls: {path:string , items:CompletionItem[]} = {path:"",items:[]};

    constructor(public globalState?: Memento) {
    }

    async  provideCompletionItems(
        document : TextDocument, 
        position : Position, 
        token    : CancellationToken,
        context  : any ): Promise<CompletionItem[]> {

            let result;

            if(document.fileName != this.controls.path) {
                const controls = env.getControlsFromPath(document.fileName,context);

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
    ctx.subscriptions.push(
            window.onDidChangeActiveTextEditor( (e : TextEditor  | undefined) => {
                
                if(!e) return;
                const mgForm = env.getMagicFormByPath(e.document.fileName);
                
                if(!mgForm) return;
                magicTreeView.reveal(mgForm);

            })
    );
}