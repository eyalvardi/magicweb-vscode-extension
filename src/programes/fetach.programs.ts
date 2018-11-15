//import fetch from 'node-fetch';
//import * as res from './programs.json';

export async function fetchPrograms() : Promise<MagicTreeItem[]>{
    //const res  = await fetch("./programs.json");
    //const json = await res.json();
    //return json;
    let json = [
        {
          "type": "folder",
          "icon": "folder",
          "name": "todo list demo",
          "children": [
            {
              "type": "program",
              "name": "TodoList",
              "icon": "program",
              "children": [
                {
                  "type": "folder",
                  "name": "forms",
                  "icon": "folder",                  
                  "children": [
                    {
                      "type": "form",
                      "name": "TodoListMain",
                      "icon": "form",
                      "path": "../../TodoListMain.json",
                      "controls": [
                        {
                          "name": "txbDesc",
                          "icon": "field",
                          "isGenerate": "false"
                        },
                        {
                          "name": "btnAddTask",
                          "icon": "field",
                          "isGenerate": "false"
                        },
                        {
                          "name": "sbTasks",
                          "icon": "field",
                          "isGenerate": "false"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "folder",
                  "name": "Tasks",
                  "children": [
                    {
                      "type" : "task",
                      "name" : "TodoListTable",
                      "children": [
                        {
                          "type": "form",
                          "name": "TodoListTableForm",
                          "icon": "form",
                          "path": "../../TodoListMain.json",
                          "controls": [
                            {
                              "name": "txbDesc",
                              "isGenerate": "false"
                            },
                            {
                              "name": "btnAddTask",
                              "isGenerate": "false"
                            },
                            {
                              "name": "sbTasks",
                              "isGenerate": "false"
                            }
                          ]
                        }    
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "program",
              "name": "Counter",
              "icon": "program",
              "children": [
                {
                  "type": "folder",
                  "name": "forms",
                  "icon": "folder",
                  "children": [
                    {
                      "type": "form",
                      "name": "TodoListMain",
                      "icon": "form",
                      "path": "../../TodoListMain.json",
                      "controls": [
                        {
                          "name": "txbDesc",
                          "isGenerate": "false"
                        },
                        {
                          "name": "btnAddTask",
                          "isGenerate": "false"
                        },
                        {
                          "name": "sbTasks",
                          "isGenerate": "false"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "folder",
                  "name": "Tasks",
                  "children": [
                    {
                      "type": "task",
                      "children": [{}]
                    }
                  ]
                }
              ]
            },
            {
              "type": "program",
              "name": "Agent Travel",
              "icon": "program",
              "children": [
                {
                  "type": "folder",
                  "name": "forms",
                  "icon": "folder",
                  "children": [
                    {
                      "type": "form",
                      "name": "TodoListMain",
                      "icon": "form",
                      "path": "../../TodoListMain.json",
                      "controls": [
                        {
                          "name": "txbDesc",
                          "isGenerate": "false"
                        },
                        {
                          "name": "btnAddTask",
                          "isGenerate": "false"
                        },
                        {
                          "name": "sbTasks",
                          "isGenerate": "false"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "folder",
                  "name": "Tasks",
                  "children": [
                    {
                      "type": "task",
                      "children": [{}]
                    }
                  ]
                }
              ]
            },
            {
              "type": "program",
              "name": "TodoList 2",
              "icon": "program",
              "children": [
                {
                  "type": "folder",
                  "name": "forms",
                  "icon": "folder",
                  "children": [
                    {
                      "type": "form",
                      "name": "TodoListMain",
                      "icon": "form",
                      "path": "../../TodoListMain.json",
                      "controls": [
                        {
                          "name": "txbDesc",
                          "isGenerate": "false"
                        },
                        {
                          "name": "btnAddTask",
                          "isGenerate": "false"
                        },
                        {
                          "name": "sbTasks",
                          "isGenerate": "false"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "folder",
                  "name": "Tasks",
                  "children": [
                    {
                      "type": "task",
                      "children": [{}]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ] as MagicTreeItem[];

      return json;
      
}

export class MagicData {
    tree : MagicTreeItem [] = [];
    folders     = new Map<number | string ,MagicTreeItem>();
    programs    = new Map<number | string ,MagicTreeItem>();
    tasks       = new Map<number | string ,MagicTreeItem>();
    forms       = new Map<number | string ,MagicTreeItem>();

    constructor( json:MagicTreeItem[] = [] ) {
        this.proccessJson(json);
    }

    getPrograms(id?:number) : MagicTreeItem | MagicTreeItem []{
        let result :  MagicTreeItem | MagicTreeItem [];               
        if(id){
            result = this.programs.get(id) as MagicTreeItem; //TODO: if null
        } else {
            result = Array.from(this.programs.values());
        }
        return result;
    }

    async loadJson(){
      const json = await fetchPrograms();
      this.proccessJson(json);
    }

    proccessJson(json:MagicTreeItem[]) {
        json.forEach( item => {
            switch (item.type) {
                case "folder":
                    this.folders.set(item.name,item);                   
                    break;
                case "program":
                    this.programs.set(item.name,item);
                    break;
                case "task":
                    this.tasks.set(item.name,item);
                    break;
                case "form":
                    this.forms.set(item.name,item);
                    break;
            }
            if(item.children && item.children.length > 0){
                this.proccessJson(item.children);          
            }            
        });       
    }
}