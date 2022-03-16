import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';


@Injectable()
export class RestProvider {

    public LangDict : any = {};

    constructor(private network: Network, 
        private http: HTTP,
        private httpClient: HttpClient) {

          let retrievedObject = localStorage.getItem("languageJSON");
          let json = JSON.parse(retrievedObject)
          this.LangDict = JSON.parse(json)

    }

    // Get Request
    GetRequest(apiName: string) {
        return new Promise((resolve, reject) => {
            let baseUrl = localStorage.getItem('base_url');

            if (this.network.type == 'none') {
                
                reject(this.LangDict['Please_Check_Your_Network_Connection']);
                
            }else {
                
                let headers = {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"
                };

                this.httpClient.get(baseUrl + apiName).subscribe((response) => {
                    debugger
                    console.log(response);
                    resolve(response);
                });

            }
        }); 
    }

    // POST Request
    postRequest(apiName : string, parameters) {

        return new Promise((resolve, reject) => {
            let baseUrl = localStorage.getItem('base_url');
            //let baseUrl = 'https://getinstacash.in/zwReturnCenter/api/v1/public/';

            //let IN = 'https://getinstacash.in/instaCash/api/v5/public/';
            //let MY = "https://getinstacash.com.my/instaCash/api/v5/public/"
            //let SG = "https://getinstacash.com.sg/instaCash/api/v5/public/"
            //let TW = "https://getinstacash.com.tw/instaCash/api/v5/public/"
            //let PH = "https://ph.getinstacash.com/instaCash/api/v5/public/"
            //let TH = "https://th.getinstacash.com/instaCash/api/v5/public/"

            
            if (this.network.type == 'none') {
                reject(this.LangDict["Please_Check_Your_Network_Connection"]);
            }else {

                let headers = {
                    'Accept':'*/*',
                    'Content-Type':'application/x-www-form-urlencoded'
                };
                

                /*
                let body = new URLSearchParams();
                body = parameters
                this.httpClient.post((baseUrl + apiName), body, { headers : headers }).subscribe((response) => {
                    debugger
                    console.log(response);
                    resolve(response);
                });
                */

            
                this.http.setDataSerializer('urlencoded');
                this.http.post((baseUrl + apiName), parameters, headers).then((response) => {
                    
                    console.log(response);
                    resolve(response);
                }).catch((error) => {
                    
                    console.log("error==>"+JSON.stringify(error));

                    reject(this.LangDict["Something_Went_Wrong_Please_Try_Again_Later."]);
                });
                
            }
        }); 
    }
 

    // GET
    languageDownload(type: string) {
        return new Promise((resolve, reject) => {

          //let baseUrl = localStorage.getItem('base_url');

            if (this.network.type!='none') {

              let headers = {
                //'Content-Type': 'text/xml; charset=utf-8',
                //'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Origin': '*',
                //'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"
              };
             
              //this.http.get(baseUrl + type, {}, headers)
              this.http.get(type, {}, headers)
                .then(data => {
                  
                  console.log(data["data"]);
                  resolve(data);
                })
                .catch(error => {
                  
                  reject(this.LangDict["Something_Went_Wrong_Please_Try_Again_Later."]);
                });
            }else{
                
                reject(this.LangDict["Please_Check_Your_Network_Connection"]);
            }
        });
    }

    postApplicationJsonData(apiName,data) {
        return new Promise((resolve, reject) => {

        let baseUrl = localStorage.getItem('base_url');
        //let baseUrl = "https://getinstacash.in/zwReturnCenter/api/v1/public/";

        if(this.network.type!='none'){

          let headers = {
            'Accept':'application/json',
            'Content-Type':'application/json'
          };
       
          this.http.setDataSerializer('json');
          this.http.post(baseUrl+apiName, data, headers)
            .then(data => {
              //console.log(data["data"]);
              resolve(data);
            })
            .catch(error => {
              reject(error);
              console.log("error==>"+JSON.stringify(error));
            });
        }else{
            reject(this.LangDict["Please_Check_Your_Network_Connection"]);        
        }
    });
    }
    
    //*
    post(data) {
        return new Promise((resolve, reject) => {

          let baseUrl = localStorage.getItem('base_url');
          
          if(this.network.type!='none'){
          let headers = {
            'Accept':'application/json',
            'Content-Type':'application/json'
          };
       
          this.http.setDataSerializer('json');
          this.http.post(baseUrl+'advanceSearch', data, headers)
          //this.http.post("https://getinstacash.in/zwReturnCenter/api/v1/public/advanceSearch", data, headers)
            .then(data => {
              console.log(data["data"]);
              resolve(data);
            })
            .catch(error => {
              reject(error);
            });
          }else{
            reject(this.LangDict["Please_Check_Your_Network_Connection"]);        
          }
        });
      }
      //*/


}
