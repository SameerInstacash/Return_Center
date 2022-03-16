import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertProvider } from 'src/Provider/Alert';
import { LoaderProvider } from 'src/Provider/Loader';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { RestProvider } from 'src/Provider/Rest';
import { AppModule } from '../app.module';
import { AppApiKey, AppUserName, loginApi } from 'src/Provider/Constant';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public LangDict : any = {};

  public strUserId : String = '';
  public strPassword : String = '';

  public myLang : any;
  public myCountry : any; 
  public countries: any[]; 
  public lang: any[]; 
  public myCountryLang :any = [];

  latitude: any = 0;
  longitude: any = 0;
  currentCountry: any = '';

  constructor(private alert: AlertProvider, private loader: LoaderProvider,
     private afDb: AngularFireDatabase, private geolocation: Geolocation,
      private nativeGeocoder : NativeGeocoder, private router: Router, 
      private rest: RestProvider) {

        if (localStorage.getItem('center_name') != null) {
          console.log('Session has been stored!');
    
          this.router.navigateByUrl('/home', { replaceUrl: true });    

        }else {

          const countryListRef: AngularFireList<any> = afDb.list('recent_countries');
          const languageListRef: AngularFireList<any> = afDb.list('recent_languages');

          countryListRef.valueChanges().subscribe( data => { 
            this.countries = data;
            this.myCountry = data[0];
          })  

          languageListRef.valueChanges().subscribe( data => {
            this.lang = data;

            if (this.countries.length > 0) {
              //console.log('country is',this.countries[0]);

              localStorage.setItem("base_url", this.myCountry.url);
              localStorage.setItem("currencySymbole", this.myCountry.currencySymbole);
              localStorage.setItem("country", this.myCountry.country);

              var lang : String = this.myCountry.lang[0];
            
              for (var i=0; i<this.lang.length; i++) {
                if (lang == this.lang[i].name) {
                    //console.log('languages is',this.lang[i]);
                    this.myLang = this.lang[i]
                    localStorage.setItem("lang_url", this.myLang.lang_url);

                    this.languageJSONFileDownloadLocally(this.myLang.lang_url);

                    break;
                }
              }

              for(var j=0; j<this.countries[0].lang.length; j++){
                for(var i=0; i<this.lang.length; i++){
                  if(this.countries[0].lang[j] == this.lang[i].name){
                     //console.log('languages are',this.lang[i]);       
                    localStorage.setItem("lang_name", this.lang[0].name as string);         
                    this.myCountryLang.push(this.lang[i]);
                  }
                }
              }


            }
        }
      ); 

      }
    
  }

  ngOnInit() {
    
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter(){
    this.getCurrentCoordinates();
  }

  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {

    this.geolocation.getCurrentPosition().then((resp) => {
      
      //console.log("latitude is ==> "+ resp.coords.latitude);
      //console.log("longitude is ==> "+ resp.coords.longitude);

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };

      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
      .then((result) => {

            JSON.stringify(result[0].countryName);
            this.currentCountry = (JSON.stringify(result[0].countryName));
            
            //console.log('current country is = ',this.currentCountry);
            console.log('current country is found as -->' , JSON.stringify(result[0].countryName));

            this.setCurrentCountry();
      })  
      .catch((error) => {
          console.log('Error 1 getting location', error);
      })
     }).catch((error) => {
          console.log('Error 2 getting location', error);
     });
  }

  setCurrentCountry() {
    console.log('Total countries are - ', this.countries.length + 1);
    console.log('Start matching');

    for (var c=0; c<this.countries.length; c++) {
      
      //console.log(this.countries[c].name, this.countries[c].name as string);
      //console.log(this.currentCountry, this.currentCountry as string);

      if (this.countries[c].name == this.currentCountry) {

        console.log('current country is matching -->' ,this.countries[c].name);

        this.myCountry = this.countries[c];
        localStorage.setItem("base_url", this.myCountry.url);
        localStorage.setItem("currencySymbole", this.myCountry.currencySymbole);
        localStorage.setItem("country", this.myCountry.country);

        var lang : String = this.myCountry.lang[0];
        this.myCountryLang = [];

        for (var j=0; j<this.countries.length; j++) {
         for (var i=0; i<this.lang.length; i++) {
            if (this.myCountry.lang[j] == this.lang[i].name) {
              //console.log(this.lang[i]);
              
              this.myCountryLang.push(this.lang[i]);
            }
          }
        }

      }
    }

  }

  logInButtonClicked() {
    
    if (this.strUserId.length == 0) {
      this.alert.presentAlertOnView(this.LangDict['Error'],this.LangDict['Please_enter_valid_user_id']);
    } else if (this.strPassword.length == 0) {
      this.alert.presentAlertOnView(this.LangDict['Error'],this.LangDict['Please_enter_valid_password']);
    } else {

      let postData = {
        "userName" : AppUserName,
        "apiKey" : AppApiKey,
        "loginUserName" : this.strUserId,
        "password" : this.strPassword,
        "application" : "",
      }
      
      //console.log(postData);
      this.loader.showLoader(this.LangDict['Logging_in']);

      this.rest.postRequest(loginApi,postData).then((responseData) => {

        this.loader.dismissLoader();
        
        console.log(JSON.parse(responseData['data']));
        //console.log("true==>"+JSON.stringify(JSON.parse(responseData['data'])));

        if (JSON.parse(responseData['data']).status == 'Success') {
          
          //console.log(JSON.parse(responseData['data']));
          
          localStorage.setItem("center_name", JSON.parse(responseData['data']).centerName);
          localStorage.setItem("returnCenterId", JSON.parse(responseData['data']).msg);

          this.router.navigateByUrl('/home', { replaceUrl: true });
          //this.router.navigate(['/home']);

        }else {
          this.alert.presentAlertOnView(this.LangDict['Error'],JSON.parse(responseData['data']).msg);
        }
      })
      .catch((error) => {
        this.alert.presentAlertOnView(this.LangDict['Error'],error);
      });

    }

  }

  navOtpLogin(){
    this.router.navigate(['/home'])
  }

  selectCountry() {
    
    var selectedArray :any = [];

    for (var i = 0; i < this.countries.length; i++){
    
      let postData : any;
      if (localStorage.getItem("base_url") as string == this.countries[i].url as string) {

        postData = {
          "name":this.countries[i].country,
          "type":"radio",
          "checked":true,
          "label":this.countries[i].name,
          "value":this.countries[i].country,
        }
      }else {

        postData = {
          "name":this.countries[i].country,
          "type":"radio",
          "checked":false,
          "label":this.countries[i].name,
          "value":this.countries[i].country,
        }
      }

      selectedArray.push(postData);
    }

    this.alert.presentLanguageCountryAlert(selectedArray, data => {
      
      console.log(data);
      this.myCountryLang = [];

      for(var i=0; i<this.countries.length; i++){
        if (data == this.countries[i].country){
          this.myCountry = this.countries[i];
          localStorage.setItem("base_url", this.myCountry.url);
          localStorage.setItem("currencySymbole", this.myCountry.currencySymbole);
          localStorage.setItem("country", this.myCountry.country);
          break
        }
      }
      
      /*
      for(var j=0; j<this.countries[0].lang.length; j++){
        for(var i=0; i<this.lang.length; i++){
          if(this.countries[0].lang[j] == this.lang[i].name){
             console.log('languages are',this.lang[i]);       
             localStorage.setItem("lang_name", this.lang[0].name as string);         
             this.myCountryLang.push(this.lang[i]);
          }
        }
      }
      */


      for(var j=0; j<this.myCountry.lang.length; j++){
        for(var i=0; i<this.lang.length; i++){
          if(this.myCountry.lang[j] == this.lang[i].name){
            
              console.log(this.lang[i]);      
            
              //localStorage.setItem("lang_name", this.lang[i].name as string);
              //this.myLang = this.lang[0];

              localStorage.setItem("lang_name", this.myCountry.lang[0] as string);
              this.myCountryLang.push(this.lang[i]);
              
              this.myLang = this.myCountryLang[0];
              localStorage.setItem("lang_url", this.myLang.lang_url); 

              this.languageJSONFileDownloadLocally(this.myLang.lang_url);

            }
          }
        }

    });
  }


  selectLang(){
  
    var selectedArray :any = [];
    for (var i = 0; i < this.myCountryLang.length; i++){
      
      let postData : any;
      if (localStorage.getItem("lang_name") as string == this.myCountryLang[i].name as string) {
        postData = {
          "name":this.myCountryLang[i].name as string,
          "type":"radio",
          "checked":true,
          "label":this.myCountryLang[i].name as string,
          "value":this.myCountryLang[i].lang_symbole as string,
        }
      }else {
        postData = {
          "name":this.myCountryLang[i].name as string,
          "type":"radio",
          "checked":false,
          "label":this.myCountryLang[i].name as string,
          "value":this.myCountryLang[i].lang_symbole as string,
        }
      }

      selectedArray.push(postData);
    }

    this.alert.presentLanguageCountryAlert(selectedArray, data => {
      for(var i=0; i<this.lang.length; i++) {

        if (data as string == this.lang[i].lang_symbole as string) {
          //console.log(this.lang[i].name as string);
          localStorage.setItem("lang_name", this.lang[i].name as string);
          localStorage.setItem("lang_url", this.lang[i].lang_url as string);

          this.languageJSONFileDownloadLocally(this.lang[i].lang_url);

          this.myLang = this.lang[i]; 
        }
      }

    });
  }


  languageJSONFileDownloadLocally(langURL) {

    this.rest.languageDownload(langURL).then((responseData) => {

      //this.loader.dismissLoader();
      
      if (JSON.parse(responseData['status']) == 200) {
        
        //console.log("Language data is ->",responseData);
        //console.log("Parsed JSON is ->",JSON.parse(responseData['data']));
        
        localStorage.setItem("languageJSON", JSON.stringify(responseData['data']));
        let retrievedObject = localStorage.getItem("languageJSON");
        let json = JSON.parse(retrievedObject)
        //console.log(json);
        this.LangDict = JSON.parse(json)
  
        console.log(this.LangDict);
        
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
