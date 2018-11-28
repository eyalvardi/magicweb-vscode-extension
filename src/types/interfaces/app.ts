import {Control} from './control';

export interface View extends Control
{

}

export interface Route{
    RouteName: string,
    OutletName: string,
    children: any[]
}

/*
* export interface Route {
    path?: string;
    pathMatch?: string;
    matcher?: UrlMatcher;
    component?: Type<any>;
    redirectTo?: string;
    outlet?: string;
    canActivate?: any[];
    canActivateChild?: any[];
    canDeactivate?: any[];
    canLoad?: any[];
    data?: Data;
    resolve?: ResolveData;
    children?: Routes;
    loadChildren?: LoadChildren;
    runGuardsAndResolvers?: RunGuardsAndResolvers;
}
* */

export interface AppJson {
    name  : string,
    suffix: string,
    views : View[]
}

export interface RouteJson
{
    routesArray: Route[]
}


export interface AppConfig
{
    //created_application_css:	boolean,
    create_route_map: boolean
    create_new_project:	boolean,
    created_menu:	boolean,
    created_views:	boolean,
    theme:	string,
    output_folder:	string,
    absolute_position:	boolean,
    backup_current:	boolean,
    source_images_folder: string,
    copy_images: boolean,
    exposed_functionality: boolean,
    allow_testing: boolean,
    project_name: string,
    form_files: string[]
}

export interface ComponentId {
    jsonPath      : string;
    componentPath : string;
    name?         : string;
    uniqueName    : string;
    magicJsonObj? : View
}

export interface AppManifest{
    components: ComponentId[]
}
