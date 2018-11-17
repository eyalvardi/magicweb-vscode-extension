import * as ejs from 'ejs';

export function createViewMagicItemReport( magicItem: MagicTreeItem ): string {
    const html = ejs.render( `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title><%= vm.name %></title>
            </head>
            <body>
                <h2><%= vm.type %>: <%= vm.name %></h2>
                <pre>
                    <%= JSON.stringify(vm) %>
                </pre>
                <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
            </body>
            </html>

    `, {vm:magicItem});

    return html;

}