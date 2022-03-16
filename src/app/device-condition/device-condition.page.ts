import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertProvider } from 'src/Provider/Alert';
import { addToStockApi, AppApiKey, AppUserName, productVerificationModifierApi } from 'src/Provider/Constant';
import { LoaderProvider } from 'src/Provider/Loader';
import { RestProvider } from 'src/Provider/Rest';


@Component({
  selector: 'app-device-condition',
  templateUrl: './device-condition.page.html',
  styleUrls: ['./device-condition.page.scss'],
})
export class DeviceConditionPage implements OnInit {

  public LangDict : any = {};

  public currentDevice : any;
  public mismatchData : any;
  public newConditionStr : any;
  public currentItemId : any;
  public strLocationId : any;
  public strCurrentLocation : any;
  public isSearch = false

  constructor(private alert: AlertProvider, private loader: LoaderProvider,
    private router: Router, private rest: RestProvider, private route: ActivatedRoute) { 

     this.route.queryParams.subscribe((params) => {
       if (this.router.getCurrentNavigation().extras.state) {

         this.currentDevice = this.router.getCurrentNavigation().extras.state.device;
         this.mismatchData = this.router.getCurrentNavigation().extras.state.data;
         this.newConditionStr = this.router.getCurrentNavigation().extras.state.conditionString;
         
         this.currentItemId = this.router.getCurrentNavigation().extras.state.itemID; 
         this.strLocationId = this.router.getCurrentNavigation().extras.state.locationID; 
         this.strCurrentLocation = this.router.getCurrentNavigation().extras.state.currentLocation; 
         this.isSearch = this.router.getCurrentNavigation().extras.state.isSearch; 
         
         
       }
     });


      let retrievedObject = localStorage.getItem("languageJSON");
      let json = JSON.parse(retrievedObject)
      this.LangDict = JSON.parse(json)
     
 }

  ngOnInit() {
    
  }


  ConfirmMismatchClicked() {
    // Call add to stock api & navigate to home page
    this.CallAddToStockApi()
  }

  DismissClicked() {
    //this.router.navigateByUrl('/expected', { replaceUrl: true });
      
      let navigationExtras: NavigationExtras = {
        state: {
          user: this.strLocationId,
          pageTitle: this.strCurrentLocation,
          flag: 'apiTrue',
          isSearch : this.isSearch
        }
      };
      
      this.router.navigate(['expected'], navigationExtras);

  }
        

  CallAddToStockApi() {

    let postData = {
      "userName" : AppUserName,
      "apiKey" : AppApiKey,
      "returnCenterId" : localStorage.getItem("returnCenterId"),
      "conditionString" : this.newConditionStr,
      "id" : this.currentItemId
    }
  
    //console.log(postData);
    this.loader.showLoader(this.LangDict['Loading...']);
  
    this.rest.postRequest(addToStockApi,postData).then((responseData) => {
  
      this.loader.dismissLoader();
      console.log(JSON.parse(responseData['data']));
      //console.log("true==>"+JSON.stringify(JSON.parse(responseData['data'])));
  
      if (JSON.parse(responseData['data']).status == 'Success') {
        
        let resultData = JSON.parse(responseData['data']).msg;
        console.log(resultData);
  
        //this.router.navigateByUrl('/expected', { replaceUrl: true });
        let navigationExtras: NavigationExtras = {
          state: {
            user: this.strLocationId,
            pageTitle: this.strCurrentLocation,
            flag: 'apiTrue',
            isSearch : this.isSearch
          }
        };
        
        this.router.navigate(['expected'], navigationExtras);
  
      }else {
        this.alert.presentAlertOnView(this.LangDict['Error'],JSON.parse(responseData['data']).msg);
      }
    })
    .catch((error) => {
      this.alert.presentAlertOnView(this.LangDict['Error'],error);
    });
  
  }

}
