import {createViewMagicWebSetting} from './views/magicWeb.setting';
import {createViewMagicItemReport} from './views/magic-item.report';


//import magicWebSetting from './views/magicWeb.setting.ejs!text';
//import magicItemReport from './views/magic-item.report.ejs!text';

//onst magicWebSetting = require('./views/magicWeb.setting.ejs');
//const magicItemReport = require('./views/magic-item.report.ejs');

const views = new Map<string,Function>();

views.set('magicWeb.setting'  , createViewMagicWebSetting);
views.set('magic-item.report' , createViewMagicItemReport);


export function getView(viewName:string,...args:any[]) : string {
    let viewFn = views.get(viewName)
    if(!viewFn) return "No view founded !!!";
    return viewFn(args[0]);
}


// export async function fetchView(view:string) : Promise<string> {

//     let resultViewStr = "";

//     if(views.has(view)){
//         resultViewStr = views.get(view) || "";
//     } else {
//         try{
//             const filePath = path.join(vscode.workspace.rootPath || "" , `./views/${view}.ejs`,);
//             console.log(`view path: ${filePath}`);
//             resultViewStr  =  await Utils.readFileAsync(`./views/${view}.ejs`);
//         } catch (ex){
//             console.dir(ex);
//         }
        
//     }

        
//     return JSON.parse(resultViewStr); 
// }
