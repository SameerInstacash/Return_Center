import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Injectable()
export class AlertProvider {

    public LangDict : any = {};
    alert: any = null;

    constructor(private alertCtrl: AlertController) {

        let retrievedObject = localStorage.getItem("languageJSON");
        let json = JSON.parse(retrievedObject)
        this.LangDict = JSON.parse(json)

    }

    // Global Alert
    async presentAlertOnView(title:String,message:String) {
        const alert = this.alertCtrl.create({
            header : title as string,
            subHeader : message as string,
            buttons : [this.LangDict['Ok']]
        });
        (await alert).present();
    }

    async presentLogoutAlert(title,message,callBack) {

        const alert = this.alertCtrl.create({
            header : title as string,
            subHeader : message as string,

            buttons : [{
                text: this.LangDict['No'],
                handler: (alertData) => {
                    callBack(true);
                }
            },{
                text: this.LangDict['Yes'],
                handler: (alertData) => {
                    callBack(false);
                }
            }]
        });
        (await alert).present();
    }

    // Language Alert
    async presentLanguageCountryAlert(langs, callback) {
        
        if (this.alert == null) {
            
            const alert = this.alertCtrl.create({
                cssClass: 'langCountry',
                header: this.LangDict['Alert'],
                inputs: langs,
                buttons: [
                    {
                        text: this.LangDict['Cancel'],
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: (alertData) => {
                            callback('Hi');
                        }
                    },
                    {
                        text: this.LangDict['Ok'],
                        handler: (alertData) => {
                            callback(alertData);
                        }
                    }
                ]
            });
            (await alert).present();
        }
    }



}