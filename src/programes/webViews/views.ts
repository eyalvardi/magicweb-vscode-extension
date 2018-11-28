import {createViewMagicWebSetting} from './views/magicWeb.setting';
import {createViewMagicItemReport} from './views/magic-item.report';

// import test from './views/test.ejs';

// console.log(`test : ${test}`);

const views = new Map<string,Function>();

views.set('magicWeb.setting'  , createViewMagicWebSetting);
views.set('magic-item.report' , createViewMagicItemReport);


export async function getView(viewName:string, vm:any, ...args:any[]) : Promise<string> {
    let viewFn = views.get(viewName)
    if(!viewFn) return "No view founded !!!";

    return await viewFn(vm);
}