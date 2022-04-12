import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AppApiKey, AppUserName, changeLocationApi, getNumberOfItemApi, getStockApi } from 'src/Provider/Constant';
import { RestProvider } from 'src/Provider/Rest';
import { AlertProvider } from 'src/Provider/Alert';
import { LoaderProvider } from 'src/Provider/Loader';
import { ActionSheetProvider } from 'src/Provider/ActionSheet';


@Component({
  selector: 'app-expected',
  templateUrl: './expected.page.html',
  styleUrls: ['./expected.page.scss'],
})
export class ExpectedPage implements OnInit {

  public LangDict : any = {};

  public arrFilteredStock : any[];
  public arrStock : any[];
  public selectedLocationId : any;
  public strCurrentLocation : string;
  public apiFlag : any;
  navCtrl: any;
  public isAdvanceSearch = false

  constructor(private route: ActivatedRoute, private router: Router, 
    private alert: AlertProvider, private loader: LoaderProvider,
    private rest: RestProvider, private actionSheet: ActionSheetProvider) { 

    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.apiFlag = this.router.getCurrentNavigation().extras.state.flag;
        this.isAdvanceSearch = this.router.getCurrentNavigation().extras.state.isSearch;

        if (this.apiFlag == 'apiTrue') {

          if (this.isAdvanceSearch == false) {
            
            this.selectedLocationId = this.router.getCurrentNavigation().extras.state.user;
            this.strCurrentLocation = this.router.getCurrentNavigation().extras.state.pageTitle;
  
            this.getStockItemsOnStockPage();
          }else {
            // Load hold data
            
          }

        }else {
          
          this.isAdvanceSearch = true
          this.arrStock = this.router.getCurrentNavigation().extras.state.searchData;
        }
        
      }
    });

    
    let retrievedObject = localStorage.getItem("languageJSON");
    let json = JSON.parse(retrievedObject)
    this.LangDict = JSON.parse(json)

  }

  ngOnInit() {

  }

  search(query) {
    if (!query) { // revert back to the original array if no query
      this.arrStock = this.arrFilteredStock;
    } else { // filter array by query

      /*
      this.arrStock = this.arrFilteredStock.filter((user) => {
        return (user.productName.toLowerCase.includes(query.toLowerCase) || 
                user.productIMEI.toLowerCase.includes(query.toLowerCase) || 
                user.productOrderId.toLowerCase.includes(query.toLowerCase)
               );
      })*/

      this.arrStock = this.arrFilteredStock.filter((user) => {
        return user.productName.toLowerCase().indexOf(query.toLowerCase()) > -1;
      });

    }
  }


  getStockItemsOnStockPage() {

    let postData = {
      "userName" : AppUserName,
      "apiKey" : AppApiKey,
      "returnCenterId" : localStorage.getItem("returnCenterId"),
      "locationId" : this.selectedLocationId,
    }
        
    //console.log(postData);
    this.loader.showLoader(this.LangDict['Loading...']);

    this.rest.postRequest(getStockApi,postData).then((responseData) => {

      this.loader.dismissLoader();

      //console.log(JSON.parse(responseData['data']));
      //console.log("true==>"+JSON.stringify(JSON.parse(responseData['data'])));

      if (JSON.parse(responseData['data']).status == 'Success') {
        
        //console.log(JSON.parse(responseData['data']));
        this.arrStock = JSON.parse(responseData['data']).msg;
        this.arrFilteredStock = this.arrStock

      }else {
        debugger
        this.alert.presentAlertOnView(this.LangDict['Error'],JSON.parse(responseData['data']).msg);
      }
    })
    .catch((error) => {
      debugger
      this.alert.presentAlertOnView(this.LangDict['Error'],error);
    });

  }


  getDetailOfSelectedStockItem(index: any) {

    if (this.apiFlag != 'apiTrue') {
      this.selectedLocationId = this.arrStock[index].currentLocation;
      //this.strCurrentLocation = this.arrStock[index].
    }


    if (this.selectedLocationId == '1') {

      this.actionSheet.presentActionSheet().then((callBackData) => {
        if (callBackData.role == '1') {
  
          let navigationExtras: NavigationExtras = {
            state: {
              currentDevice : this.arrStock[index],
              currentLocation : this.strCurrentLocation,
              locationID : this.selectedLocationId,
              isSearch : this.isAdvanceSearch
            }
          };
          
          this.router.navigate(['device-check-up'], navigationExtras);
  
        }else if (callBackData.role == '2') {
  
          let navigationExtras: NavigationExtras = {
            state: {
              currentDevice : this.arrStock[index],
              currentLocation : this.strCurrentLocation,
              locationID : this.selectedLocationId,
              isSearch : this.isAdvanceSearch
            }
          };
          
          this.router.navigate(['product-info'], navigationExtras);
  
        }else {
           // Just dismiss
        }
      });

    }else if (this.selectedLocationId == '4') {

      this.actionSheet.presentActionSheetForDispatch().then((callBackData) => {
        if (callBackData.role == '1') {

          // Call changeLocation Api for move item from stock to dispatch
          this.callChangeLocationApi(index);
          
        }else if (callBackData.role == '2') {
          
          let navigationExtras: NavigationExtras = {
            state: {
              currentDevice : this.arrStock[index],
              currentLocation : this.strCurrentLocation,
              locationID : this.selectedLocationId
            }
          };
          
          this.router.navigate(['product-info'], navigationExtras);
  
        }else {
           // Just dismiss
        }
      });

    }else {

      // Just show product info on next page
      this.actionSheet.presentActionSheetForProductInfo().then((callBackData) => {
        if (callBackData.role == '1') {

          let navigationExtras: NavigationExtras = {
            state: {
              currentDevice : this.arrStock[index],
              currentLocation : this.strCurrentLocation,
              locationID : this.selectedLocationId
            }
          };
          
          this.router.navigate(['product-info'], navigationExtras);
          
        }else if (callBackData.role == '2') {
          
          // Just dismiss
  
        }else {
           // Just dismiss
        }
      });

      
    }

  }; 


  callChangeLocationApi(selIndex) {

    let postData = {
      "userName" : AppUserName,
      "apiKey" : AppApiKey,
      "returnCenterId" : localStorage.getItem("returnCenterId"),
      "id" : this.arrStock[selIndex].id,
      "currentLocation" : '4',
      "newLocation" : '8'
    }
  
    //console.log(postData);
    this.loader.showLoader(this.LangDict['Loading...']);
  
    this.rest.postRequest(changeLocationApi,postData).then((responseData) => {
      
      this.loader.dismissLoader();
      
      //console.log(JSON.parse(responseData['data']));
      //console.log("true==>"+JSON.stringify(JSON.parse(responseData['data'])));
  
      if (JSON.parse(responseData['data']).status == 'Success') {
        
        let resultData = JSON.parse(responseData['data']).msg;
        console.log(resultData);
  
        this.getStockItemsOnStockPage()      
  
      }else {
        debugger
        this.alert.presentAlertOnView(this.LangDict['Error'],JSON.parse(responseData['data']).msg);
      }
    })
    .catch((error) => {
      debugger
      this.alert.presentAlertOnView(this.LangDict['Error'],error);
    });
  
  }
  

}


