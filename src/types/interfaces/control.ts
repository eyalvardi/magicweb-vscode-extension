import {HorizontalAlignments} from '../enums/horizontal-alignments.enum';
import {
  CtrlImageStyle,
  MgControlType,
  SideType,
  StorageAttributeType,
  TableWebStyle,
  RowEditingTypes,
  WindowType
} from "../enums/Enums";
import {CtrlButtonTypeGui} from '../enums/Enums';

export interface Exp
{
	has_exp?: boolean
}

export interface Boolean_Exp extends Exp
{
	value?: boolean,
}

export interface Number_Exp extends Exp
{
	value?: number,
}

export interface String_Exp extends Exp
{
	value?: string,
}

export interface Control {
	controlType: MgControlType
	classes?: string
	hasClassExpression?: boolean
	style: {
		font?: Number_Exp,
		color?: Number_Exp,
		border?: Boolean_Exp,
		border_style?: Number_Exp,
		focus_color?: Number_Exp,
		alignment: {
			horizontal?: HorizontalAlignments,
			vertical?: number,
		},
        line_divider?:Boolean_Exp;
        multiline_edit?: boolean,
	},
	props: {
		id: string,
		name?: string,
    component_uniquename?: string;
    component_path?:string;
    visible?: Exp,
		enabled?: Exp,
		tab_order?: Number_Exp,
		password_edit?: Boolean_Exp,
		button_style?:CtrlButtonTypeGui,
    is_table_child?: boolean,
    table_row_height?: number,
    table_title_height?: number,
    scroll_bar?: boolean;
    no_modifiable_descendants?: boolean;
    modifiable?: Boolean_Exp,
		layer?: number,
    tab_control_side?: SideType;
    attribute?: StorageAttributeType;
    web_style?: TableWebStyle;
    row_editing_type?: RowEditingTypes;
    pattern?: string;
    directive?: string;
    validator?: string;
    formatter?: string;
    window_type?: WindowType;
    is_router_outlet?: boolean;
    default_outlet?: boolean;
    wallpaper?: string;
    wallpaper_style?: CtrlImageStyle;
    sortable?: boolean;
    common_line_id?: number;
    dataexp?:boolean;
	}

	hint: {
		text?: String_Exp,
	}
	coordinates:{
        x?:	number,
        y?:	number,
        width:	number,
        height?:	number
	}
	children: null | Control[],


	/// incode members:
	// class_name_in_css: string;

}
