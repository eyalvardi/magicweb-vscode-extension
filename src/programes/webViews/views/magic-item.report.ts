import * as ejs from 'ejs';
import * as path from 'path';
import { Utils } from '../../../schematics/utils';

export async function createViewMagicItemReport( magicItem: MagicTreeItem ): Promise<string> {
    let html = "No data";
    const filePath = path.resolve(__dirname,  '../../../../ejs/item.view.ejs' );
    const itemView = await Utils.readFileAsync(filePath)
    try {
        html = ejs.render( itemView , {vm:magicItem});
    } catch (error) {
        html = JSON.stringify(error.message);
    }    
    return html;
}