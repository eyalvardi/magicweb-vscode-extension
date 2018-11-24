import * as ejs from 'ejs';
import { env } from '../../magic.extension';

export function createViewMagicWebSetting ( magicItem: MagicTreeItem ): string {
    const html = ejs.render(/*html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>MagicWeb.io</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        </head>
        <body>
            <h2>MagicWeb Visual Code Extension Settings</h2>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <button id="refresh">Search for magic metadata folders</button><br>
                        <hr>
                        
                          <% env.magicMetadataPaths.forEach( path => { %>
                            ${mgPrj}
                          <% })%>  
                      
                    </div>                    
                </div>                
            </div>           
        </body>
        <script>
        (function() {
            const vscode = acquireVsCodeApi();
            const btn = document.getElementById('refresh');
            btn.addEventListener('click',()=>{
                vscode.postMessage({
                        command: 'magic.refreshMetadata',
                        text   : 'Search for magic metadata folders' 
                });  
            });
        }());
    </script>
        </html>
        `, {
            vm  : magicItem,
            env : env
        });

        return html;
    
    }
    
    
const mgPrj = //html
`
    <div>
        <h3><%= path %></h3>
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Status</th>
                        <th scope="col">Item</th>
                    </tr>
                </thead>
                <tbody>
                    <tr scope="row">
                        <td>yes</td>
                        <td>Metadata</td>
                    </tr>
                    <tr scope="row">
                        <td>yes</td>
                        <td>Config</td>
                    </tr>
                    <tr scope="row">
                        <td>yes</td>
                        <td>Server Config</td>
                    </tr>
                </tbody>                
            </table>
        </div>
    </div>
`;    