import { Injectable } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { callbackify } from "util";

@Injectable()
export class ActionSheetProvider {

    public LangDict : any = {};

    constructor(private actionSheetCtrl: ActionSheetController) {

        let retrievedObject = localStorage.getItem("languageJSON");
        let json = JSON.parse(retrievedObject)
        this.LangDict = JSON.parse(json)

    }

    async presentActionSheet() {
        
        const actionSheet = this.actionSheetCtrl.create({
            
            buttons : [{
                text : this.LangDict['Check_Device'],
                role : '1',
               
            },
            {   
                text : this.LangDict['Product_Info'],
                role : '2',
            
            }]
        });

        (await actionSheet).present();
        //const { role, data } = await (await actionSheet).onDidDismiss();

        let data = await (await actionSheet).onDidDismiss();
        return data

    }


    async presentActionSheetForDispatch() {
        
        const actionSheet = this.actionSheetCtrl.create({
            
            buttons : [{
                text : this.LangDict['Dispatch'],
                role : '1',
               
            },
            {   
                text : this.LangDict['Product_Info'],
                role : '2',
            
            }]
        });

        (await actionSheet).present();
        //const { role, data } = await (await actionSheet).onDidDismiss();

        let data = await (await actionSheet).onDidDismiss();
        return data

    }


    async presentActionSheetForProductInfo() {
        
        const actionSheet = this.actionSheetCtrl.create({
            
            buttons : [{
                text : this.LangDict['Product_Info'],
                role : '1',
               
            },
            {   
                text : this.LangDict['Dismiss'],
                role : '2',
            
            }]
        });

        (await actionSheet).present();
        //const { role, data } = await (await actionSheet).onDidDismiss();

        let data = await (await actionSheet).onDidDismiss();
        return data

    }


}