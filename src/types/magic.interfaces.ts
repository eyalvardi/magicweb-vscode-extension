
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
    isBootstrap?: boolean;

}

// declare module '*.ejs' {
//     const value: string;
//     export default value
//   }


interface Control {
    style:       null;
    props:       ControlProps;
    coordinates: ControlCoordinates;
    hint:        null;
    controlType: null;
    children:    ControlChild[];
  }
  
  interface ControlChild {
    style:       null;
    props:       TentacledProps;
    coordinates: PurpleCoordinates;
    hint:        null;
    controlType: string;
    children:    PurpleChild[];
  }
  
  interface PurpleChild {
    style:       null;
    props:       FluffyProps;
    coordinates: FluffyCoordinates;
    hint:        null;
    controlType: string;
    children:    FluffyChild[];
  }
  
  interface FluffyChild {
    style:       Style | null;
    props:       PurpleProps;
    coordinates: PurpleCoordinates;
    hint:        null;
    controlType: string;
    children:    null;
  }
  
  interface PurpleCoordinates {
    x:      number;
    y:      number;
    width:  number;
    height: number;
  }
  
  interface PurpleProps {
    id:             string;
    tab_order:      number;
    modifiable?:    boolean;
    pattern?:       string;
    attribute:      string;
    is_table_child: boolean;
    web_style:      number;
    common_line_id: string;
    formatter?:     string;
    items_list?:    string;
    text?:          string;
    format?:        string;
  }
  
  interface Style {
    border:          boolean;
    alignment:       Alignment;
    multiline_edit?: boolean;
  }
  
  interface Alignment {
    horizontal: number;
    vertical:   null;
  }
  
  interface FluffyCoordinates {
    width: number;
  }
  
  interface FluffyProps {
    id:             string;
    is_table_child: boolean;
    web_style:      number;
    column_title?:  string;
  }
  
  interface TentacledProps {
    id:                 string;
    table_row_height:   number;
    web_style:          number;
    table_title_height: number;
    common_line_id:     string;
  }
  
  interface ControlCoordinates {
    width:  number;
    height: number;
  }
  
  interface ControlProps {
    id:                   string;
    component_path:       string;
    component_uniquename: string;
  }





  declare module '*!text' {
    const value: string;
    export default value
  }





