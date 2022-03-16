import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { RestProvider } from 'src/Provider/Rest';
import { AlertProvider } from 'src/Provider/Alert';
import { LoaderProvider } from 'src/Provider/Loader';


@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.page.html',
  styleUrls: ['./product-info.page.scss'],
})
export class ProductInfoPage implements OnInit {

  public LangDict : any = {};

  public currentDevice : any;
  public strCenterName : any;
  public strLocation : any;
  public strLocationID : any;
  public strItemId : any;
  public isSearch = false

  constructor(private route: ActivatedRoute, private router: Router, 
    private alert: AlertProvider, private loader: LoaderProvider,
    private rest: RestProvider) { 

      this.route.queryParams.subscribe((params) => {
        if (this.router.getCurrentNavigation().extras.state) {
  
          this.currentDevice = this.router.getCurrentNavigation().extras.state.currentDevice;
          this.strLocation = this.router.getCurrentNavigation().extras.state.currentLocation;
          this.strItemId = this.currentDevice.id
          this.strLocationID = this.router.getCurrentNavigation().extras.state.locationID;
          this.isSearch = this.router.getCurrentNavigation().extras.state.isSearch;
          
          this.strCenterName = localStorage.getItem("center_name");
        }
      });
    

      let retrievedObject = localStorage.getItem("languageJSON");
      let json = JSON.parse(retrievedObject)
      this.LangDict = JSON.parse(json)

  }

  ngOnInit() {
    
  }

  takeActionBtnClicked() {
    
  }

  checkDeviceBtnClicked() {

    let navigationExtras: NavigationExtras = {
      state: {
        currentDevice : this.currentDevice,
        currentLocation : this.strLocation,
        locationID : this.strLocationID,
        isSearch : this.isSearch
      }
    };
    
    this.router.navigate(['device-check-up'], navigationExtras);

  }

}
