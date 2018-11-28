import {GeneratedFileTypes} from '../enums/generated-file-types.enum';

// template for generating different file types
export interface TemplateConfig
{
	template: string
	name: string,
	destination: string
	type:GeneratedFileTypes,
	data : object
}
