import * as ejs from 'ejs';
import { env } from '../../magic.extension';

export function createViewMagicWebSetting ( magicItem: MagicTreeItem ): string {
    const html = ejs.render( `
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
                        Metadata paths:
                        <ul>
                          <% env.magicMetadataPaths.forEach( path => { %>
                            <li><%= path %></li>
                          <% })%>  
                        </ul>
                    </div>                    
                </div>                
            </div>
            <h2>Components Status</h2>
            <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Component</th>
                    <th scope="col">Generate</th>
                    <th scope="col">Numbers of Controls</th>
                    <th scope="col">Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>                  
                </tbody>
              </table>
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