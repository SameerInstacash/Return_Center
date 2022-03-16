import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertProvider } from 'src/Provider/Alert';
import { AppApiKey, AppUserName, getNumberOfItemApi } from 'src/Provider/Constant';
import { LoaderProvider } from 'src/Provider/Loader';
import { RestProvider } from 'src/Provider/Rest';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public LangDict : any = {};

  public arrItems : any[];
  public strCenterName : string;
  //public arrLocationName : Array<string> = [];

  constructor(private alert: AlertProvider, private loader: LoaderProvider,
    private router: Router, private rest: RestProvider) {

    this.strCenterName = localStorage.getItem("center_name");


    let retrievedObject = localStorage.getItem("languageJSON");
    let json = JSON.parse(retrievedObject)
    this.LangDict = JSON.parse(json)
    
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter(){
    this.getNumberOfItemsOnHomePage();
  }

  getNumberOfItemsOnHomePage() {

    let postData = {
      "userName" : AppUserName,
      "apiKey" : AppApiKey,
      "returnCenterId" : localStorage.getItem("returnCenterId"),
      "page" : '',
    }

    //console.log(postData);
    this.loader.showLoader(this.LangDict['Loading...']);

    this.rest.postRequest(getNumberOfItemApi,postData).then((responseData) => {

      this.loader.dismissLoader();
      
      //console.log(JSON.parse(responseData['data']));
      //console.log("true==>"+JSON.stringify(JSON.parse(responseData['data'])));

      if (JSON.parse(responseData['data']).status == 'Success') {
        
        console.log(JSON.parse(responseData['data']));
        this.arrItems = JSON.parse(responseData['data']).msg;

        /*
        for (let i = 0; i<this.arrItems.length; i++) {
          this.arrLocationName.push(this.arrItems[i].locationName);
        }
        console.log(this.arrLocationName.length, this.arrLocationName);
        */
        

      }else {
        this.alert.presentAlertOnView(this.LangDict['Error'],JSON.parse(responseData['data']).msg);
      }
    })
    .catch((error) => {
      this.alert.presentAlertOnView(this.LangDict['Error'],error);
    });

  }

  getStockOfSelectedItem(index: any) {

    let navigationExtras: NavigationExtras = {
      state: {
        user: this.arrItems[index].locationId,
        pageTitle: this.arrItems[index].locationName,
        flag: 'apiTrue',
        isSearch : false
      }
    };
    
    this.router.navigate(['expected'], navigationExtras);

  }; 

  refreshBtnClicked() {
    console.log('Refresh clicked');
    this.getNumberOfItemsOnHomePage();
  }

  logoutBtnClicked() {
    console.log('Logout clicked');
    this.alert.presentLogoutAlert(this.LangDict['Logout'],this.LangDict['Are_you_sure_you_want_to_logout?'], (data:Boolean) => {

      if (data) {
        console.log('Action cancelled');
      }else {
        localStorage.removeItem('center_name');
        console.log('Session has been removed!');
        this.router.navigateByUrl('/login', { replaceUrl: true });      
      }
      
    });
  }
  
  advanceSearchBtnClicked() {
    //this.router.navigate(['advance-search']);

    let navigationExtras: NavigationExtras = {
      state: {
        locations: this.arrItems,
      }
    };
    
    this.router.navigate(['advance-search'], navigationExtras);

  }
  

}
