
declare type MagicTypeItem =  "folder" | "program" | "task" | "form" | "field" | "component";


interface MagicComponentTreeItem {
    name        : string;
    htmlPath    : string;
    tsPath      : string;
    cssPath?    : string;
    icon?       : MagicTypeItem;
    status?     : string;
}

interface MagicTreeItem {
    id          : string;
    name        : string;
    type        : MagicTypeItem;
    icon?       : MagicTypeItem;
    path?       : string;
    isGenerate? : boolean,
    children?   : MagicTreeItem[];
    size?       : number;
    component?  : MagicComponentTreeItem,
    controls?   : MagicTreeItem[];

}




