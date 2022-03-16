import { LoadingController } from "@ionic/angular";
import { Injectable } from "@angular/core";

@Injectable()
export class LoaderProvider {

    public LangDict : any = {};

    constructor(public loader:LoadingController) {

        let retrievedObject = localStorage.getItem("languageJSON");
        let json = JSON.parse(retrievedObject)
        this.LangDict = JSON.parse(json)

    }

    async showLoader(strMessage: string) {
        const loading = this.loader.create({
            message: strMessage,
            //message: '<ion-img src="/assets/img/india.png" alt="loading..."></ion-img>',
            cssClass: 'scale-down-center',
            translucent: true,
            showBackdrop: true,
            spinner: null,
            duration: 4000
        });

        (await loading).present();
    }

    dismissLoader() {
        this.loader.dismiss();
    }

}