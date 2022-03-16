import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { advanceSearchApi, AppApiKey, AppUserName, getNumberOfItemApi, getStockApi, SEARCH_TYPE_DATE, SEARCH_TYPE_IMEI, SEARCH_TYPE_ORDER_ID } from 'src/Provider/Constant';
import { RestProvider } from 'src/Provider/Rest';
import { AlertProvider } from 'src/Provider/Alert';
import { LoaderProvider } from 'src/Provider/Loader';
import { ActionSheetProvider } from 'src/Provider/ActionSheet';


@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.page.html',
  styleUrls: ['./advance-search.page.scss'],
})
export class AdvanceSearchPage implements OnInit {

  public LangDict : any = {};

  public arrLocations : any[];
  public strSelectedLocation = '';
  public myIndex: number = 0;

  public strOrderId : String = '';
  public strIMEI : String = '';
  public strFromDate : String = '';
  public strToDate : String = '';

  constructor(private route: ActivatedRoute, private router: Router, 
    private alert: AlertProvider, private loader: LoaderProvider,
    private rest: RestProvider, private actionSheet: ActionSheetProvider) { 

    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.arrLocations = this.router.getCurrentNavigation().extras.state.locations;
        
      }
    });


    let retrievedObject = localStorage.getItem("languageJSON");
    let json = JSON.parse(retrievedObject)
    this.LangDict = JSON.parse(json)

  }

  ionViewWillEnter(){
    let retrievedObject = localStorage.getItem("languageJSON");
    let json = JSON.parse(retrievedObject)
    this.LangDict = JSON.parse(json)
  }

  ngOnInit() {

  }

  public locationSelect(): void { 
    console.log(this.strSelectedLocation);
    console.log(this.myIndex);

    for (let i = 0; i<this.arrLocations.length; i++) {
      if (this.arrLocations[i].locationName as string == this.strSelectedLocation ) {
        this.myIndex = i
        
        console.log(this.myIndex);
      }
    }

  }


  advanceSearchData(searchType:string) {
    
    let postData : any;
    
    if (searchType == SEARCH_TYPE_ORDER_ID) {
      
      if (this.strOrderId == '') {
        this.alert.presentAlertOnView(this.LangDict['Alert'],this.LangDict['Please_enter_valid_Order_Id']);
        return
      }else {

        postData = {
          "userName" : AppUserName,
          "apiKey" : AppApiKey,
          "returnCenterId" : localStorage.getItem("returnCenterId"),
          "searchType" : searchType,
          "searchValue" : {
                          'orderId' : this.strOrderId,
                          'page' : 0
                          }
        }

      }
  
    }else if (searchType == SEARCH_TYPE_IMEI) {
      
      if (this.strIMEI == '') {
        this.alert.presentAlertOnView(this.LangDict['Alert'],this.LangDict['Please_enter_valid_IMEI']);
        return
      }else {
      
        postData = {
          "userName" : AppUserName,
          "apiKey" : AppApiKey,
          "returnCenterId" : localStorage.getItem("returnCenterId"),
          "searchType" : searchType,
          "searchValue" : {
                          'IMEI' : this.strIMEI,
                          'page' : 0
                          },
        }

      }
  
    }else if (searchType == SEARCH_TYPE_DATE) {
      
      if (this.strFromDate == '' && this.strToDate == '') {
        this.alert.presentAlertOnView(this.LangDict['Alert'],this.LangDict['Please_select_valid_date']);
        return
      }else {
      
        postData = {
          "userName" : AppUserName,
          "apiKey" : AppApiKey,
          "returnCenterId" : localStorage.getItem("returnCenterId"),
          "searchType" : searchType,
          "searchValue" : {
                          'fromDate' : this.strFromDate,
                          'toDate' : this.strToDate,
                          'page' : 0
                          },
        }

      }
      
    }else {
      
      if (this.strSelectedLocation == '') {
        this.alert.presentAlertOnView(this.LangDict['Alert'],this.LangDict['Please_select_location']);
        
      }else {
        let navigationExtras: NavigationExtras = {
          state: {
            user: this.arrLocations[this.myIndex].locationId,
            pageTitle: this.arrLocations[this.myIndex].locationName,
            flag: 'apiTrue',
            isSearch : false,
          }
        };
        
        this.router.navigate(['expected'], navigationExtras);
      }

      return
  
    }
    
    console.log(postData);
    this.loader.showLoader(this.LangDict['Loading...']);
    
    this.rest.postApplicationJsonData(advanceSearchApi,postData).then((responseData) => {
    //this.rest.post(postData).then((responseData) => {
      
      this.loader.dismissLoader();
      
      //console.log(JSON.parse(responseData['data']));
      //console.log("true==>"+JSON.stringify(JSON.parse(responseData['data'])));

      if (JSON.parse(responseData['data']).status == 'Success') {
        
        console.log(JSON.parse(responseData['data']));
        console.log(JSON.parse(responseData['data']).data);

        let navigationExtras: NavigationExtras = {
          state: {
            searchData: JSON.parse(responseData['data']).data,
            //pageTitle: this.arrLocations[this.myIndex].locationName
            //locationID: this.arrLocations[this.myIndex].locationId,
            isSearch : true,
            flag: 'apiFalse'
          }
        };
        
        this.router.navigate(['expected'], navigationExtras);

      }else {
        debugger
        this.alert.presentAlertOnView(this.LangDict['Error'],JSON.parse(responseData['data']).msg);
      }
    })
    .catch((error) => {
      console.log(error);
      debugger
      this.loader.dismissLoader();
      this.alert.presentAlertOnView(this.LangDict['Error'],error);
    });

  }

 
}
