
interface MagicComponentTreeItem {
    name        : string;
    htmlPath    : string;
    tsPath      : string;
    cssPath?    : string;
    icon?       : string;
    status?     : string;
}

interface MagicTreeItem {
    id        : number;
    type      : "folder" | "program" | "task" | "form";
    name      : string;
    icon?     : string;
    path?     : string;
    status?   : "sync" | "notSync" | "generate";
    isGenerate? : boolean,
    children? : MagicTreeItem[];
    component?: MagicComponentTreeItem,
    controls?: MagicTreeItem[];

}




