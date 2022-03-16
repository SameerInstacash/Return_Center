import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertProvider } from 'src/Provider/Alert';
import { AppApiKey, AppUserName, changeLocationApi, productVerificationModifierApi, verifyProductApi } from 'src/Provider/Constant';
import { LoaderProvider } from 'src/Provider/Loader';
import { RestProvider } from 'src/Provider/Rest';

@Component({
  selector: 'app-device-check-up',
  templateUrl: './device-check-up.page.html',
  styleUrls: ['./device-check-up.page.scss'],
})
export class DeviceCheckUpPage implements OnInit {

  public LangDict : any = {};

  //public arrQuestionData : any = [];
  public selCurrentDevice : any;
  public strProductId : any;
  public strItemId : any;
  public strLocationId : any;
  public strStatus : any;
  public strId : any;
  public strCrLocation : any;
  public isSearch = false
  

  keys : String[];
  question_data: any;
  order_data: any;
  itemIndex:any = 0;
  isNextShow:boolean =false;
  public oldStr:String = "";
  public str:String = "";
  public orderItemId:String = "";
  public condition = [];
  navController: any;
  currentProgress = 0.0


  constructor(private alert: AlertProvider, private loader: LoaderProvider,
     private router: Router, private rest: RestProvider, private route: ActivatedRoute) { 

      this.route.queryParams.subscribe((params) => {
        if (this.router.getCurrentNavigation().extras.state) {

          this.selCurrentDevice = this.router.getCurrentNavigation().extras.state.currentDevice;
          this.strProductId = this.selCurrentDevice.productId
          this.strItemId = this.selCurrentDevice.id
          this.strStatus = this.selCurrentDevice.status
          this.strLocationId = this.router.getCurrentNavigation().extras.state.locationID;
          this.strCrLocation = this.router.getCurrentNavigation().extras.state.currentLocation;
          this.isSearch = this.router.getCurrentNavigation().extras.state.isSearch;
          
          
          this.getAllQuestionsData();
        }
      });


      let retrievedObject = localStorage.getItem("languageJSON");
      let json = JSON.parse(retrievedObject)
      this.LangDict = JSON.parse(json)
      
  }

  ngOnInit() {

  }

  getAllQuestionsData() {

      let postData = {
        "userName" : AppUserName,
        "apiKey" : AppApiKey,
        "returnCenterId" : localStorage.getItem("returnCenterId"),
        "productId" : this.strProductId,
        "itemId" : this.strItemId,
        "status" : this.strStatus
      }

      //console.log(postData);
      this.loader.showLoader(this.LangDict['Fetching_Questions']);

      this.rest.postRequest(productVerificationModifierApi,postData).then((responseData) => {

        this.loader.dismissLoader();
        
        //console.log(JSON.parse(responseData['data']));
        //console.log("true==>"+JSON.stringify(JSON.parse(responseData['data'])));

        if (JSON.parse(responseData['data']).status == 'Success') {
          
          let resultData = JSON.parse(responseData['data'])
          this.question_data = resultData.msg.questions
          this.strId = resultData.msg.id
          
          //this.arrQuestionData = resultData.questions
          //console.log('question array is : ',this.arrQuestionData.length, this.arrQuestionData);

          if(resultData.selectString){
            this.oldStr = resultData.selectString;
            console.log('old Answers string is ',this.oldStr);
            

            /*
            this.arrOldStr = this.oldStr.split(';');
            for (let i=0; i<this.arrOldStr.length; i++) {
              debugger
              console.log(this.arrOldStr[i]);
            }
            */
            
          }

    
          //this.orderItemId = this.question_data.orderItemId;

          for (var i = 0; i < (this.question_data).length; i++){
            this.question_data[i]["checked"] = {"test":"test"};
          }

          console.log(this.question_data);

          for (var i = 0; i < (this.question_data).length; i++){
            
            if(this.question_data[i].specificationValue){    
              
              var old_ans:String = '';
              var temp:String = this.question_data[i].code;
              for (var j = 0; j < (this.question_data[i].specificationValue).length; j++){          
                this.question_data[i].specificationValue[j]["isCheck"] = false;
                this.question_data[i].specificationValue[j]["code"] = this.question_data[i].code;

                if (this.oldStr.includes(this.question_data[i].specificationValue[j].id)) {
                  if(old_ans.length==0){
                    
                    old_ans = this.question_data[i].specificationValue[j].value;
                  }else{
                    
                    old_ans = old_ans+", "+this.question_data[i].specificationValue[j].value;
                  }
                }
           
                
                //if(this.question_data[i].specificationValue[j].default == '1'){
                  //SAMEER //old_ans = this.question_data[i].specificationValue[0].value;

                  /*
                  if(this.question_data[i].specificationValue[j].code == this.question_data[i].code){
                    if(old_ans.length==0){
                      debugger
                      old_ans = this.question_data[i].specificationValue[j].value;
                    }else{
                      debugger
                      old_ans = old_ans+", "+this.question_data[i].specificationValue[j].value;
                    }
                  }
                  */

                //}
              }
      
              let data = {
                "question":this.question_data[i].specificationName,
                "old_ans":old_ans,
                "new_ans":"",
                "code":this.question_data[i].code
              }    
              
              this.condition.push(data);   
              
            }
      
            if(this.question_data[i].conditionValue){      
              var old_ans:String = '';
              
              for (var j = 0; j < (this.question_data[i].conditionValue).length; j++){          
                this.question_data[i].conditionValue[j]["isCheck"] = false;
                this.question_data[i].conditionValue[j]["code"] = this.question_data[i].code;
                
                console.log("default"+this.question_data[i].conditionValue[j].dafault);

                if (this.oldStr.includes(this.question_data[i].conditionValue[j].id)) {
                  if(old_ans.length==0){
                    
                    old_ans = this.question_data[i].conditionValue[j].value;
                  }else{
                    
                    old_ans = old_ans+", "+this.question_data[i].conditionValue[j].value;
                  }
                }

                //if(this.question_data[i].conditionValue[j].dafault == '1'){
                  //SAMEER //old_an = this.question_data[i].conditionValue[0].value;
                  
                  /*
                  if(this.question_data[i].conditionValue[j].code == this.question_data[i].code){
                    console.log("code"+this.question_data[i].conditionValue[j].code);
                    if(old_an.length==0){
                      old_an = this.question_data[i].conditionValue[j].value;
                    }else{
                      old_an = old_an+", "+this.question_data[i].conditionValue[j].value;
                    }
                  }
                  */



                //}

              }
      
              let data = {
                "question":this.question_data[i].conditionSubHead,
                "old_ans":old_ans,
                "new_ans":"",
                "code":this.question_data[i].code
                  }         
                  
              this.condition.push(data);   
              
            }
           
          }

          console.log(this.condition);
   
          if(this.question_data[this.itemIndex].viewType=='checkbox'){
            debugger
            this.isNextShow = true;
          }else{
            debugger
            this.isNextShow = false;
          }

        }else {
          this.alert.presentAlertOnView(this.LangDict['Error'],JSON.parse(responseData['data']).msg);
        }
      })
      .catch((error) => {
        this.alert.presentAlertOnView(this.LangDict['Error'],error);
      });

  }


  quest = [];
  radioGroupChange(event, index, id:String){
    
    console.log("radioSelect",event.detail.value);
    console.log("index",index);

    var count = Object.keys(this.question_data).length;
   
    var q_data:any = event.detail.value;

   if((count-1) == this.itemIndex){
    
    //this.quest.splice(index, 1, event.detail.value as String);
    
    let i =  this.quest.findIndex(x => x.code === q_data.code);
    console.log(i);
    if(i != -1){
      for (let ques of this.quest) {
        if (q_data.code === ques.code) {
          
            this.quest.splice(this.quest.indexOf(ques), 1);
            this.quest.push(q_data);
            break;
        }
       }
    }else{
      
      this.quest.push(q_data);
    }
    
    this.verifyProduct();
    console.log(this.quest);
   

   }else{
    //this.itemIndex = index+1;
    //this.quest.splice(index, 1, event.detail.value as String);

    let i =  this.quest.findIndex(x => x.code === q_data.code);
      console.log(i);
      if(i != -1){
        
        for (let ques of this.quest) {
          if (q_data.code === ques.code) {
            
              this.quest.splice(this.quest.indexOf(ques), 1);
              this.quest.push(q_data);
              break;
          }
         }
      }else{
        
        this.quest.push(q_data);
      }
      this.question_data[this.itemIndex]["checked"] = event.detail.value;
    console.log(this.quest);

   }
   
  }


  checked = [];
  //Adds the checkedbox to the array and check if you unchecked it
  addCheckbox(event, checkbox : any, index) {   
   
    if ( event.target.checked ) {
      checkbox["isCheck"] = true;
      let index =  this.checked.findIndex(x => x.id === checkbox.id);
      console.log(index);
      if(index != -1){
        
        //this.checked.splice(index,1);
      }else{
        
        this.checked.push(checkbox);
      }
     
    } 
    else {
      
      checkbox["isCheck"] = false;
      let index =  this.checked.findIndex(x => x.id === checkbox.id);
      console.log(index);
      this.checked.splice(index,1);
    }
    
    console.log(this.checked); 
  }


  nextClick() {
    
   //Do whatever
   var count = Object.keys(this.question_data).length;
   console.log("this.itemIndex==>"+this.itemIndex);
   console.log("count==>"+(count-1));
   if((count-1) > this.itemIndex){

    this.itemIndex = this.itemIndex+1;

    this.currentProgress = (this.itemIndex/this.question_data.length)

    console.log(this.checked);
    
    if(this.question_data[this.itemIndex].viewType=='checkbox'){
      debugger
      this.isNextShow = true;
    }else{
      debugger
      this.isNextShow = false;
    }

   }

   if((count-1)==this.itemIndex){
    
     this.verifyProduct();
   }
 
 }


 backClick(){
  
   if(this.itemIndex>0){
    
    this.itemIndex = this.itemIndex-1;

    this.currentProgress = (this.itemIndex/this.question_data.length)

   }
   
   
   this.isNextShow = true;
 }

  backNav(){
    this.navController.back();
  }


  radioClick(index){
    
    console.log(index);

    setTimeout(() => {
      
      this.itemIndex = index+1;

      this.currentProgress = (this.itemIndex/this.question_data.length)

      console.log("==>"+index);

       if(this.question_data[this.itemIndex].viewType=='checkbox'){
          debugger
          this.isNextShow = true;
        }else{
          debugger
          this.isNextShow = false;
        }

    },400);
  
  }


  strArray = [];
  verifyProduct() {
    
  console.log(this.quest, this.quest.length);
  console.log('Verify product api call here');

  var newStr: String = '';
  var newCondtion = [];
 
  for (var i = 0; i < this.quest.length; i++){
    this.strArray.push(this.quest[i]);
    if(i==0){
      newStr = this.quest[i].id;
    }else{
      newStr = newStr +";"+this.quest[i].id;
    }
    
  }

  for (var i = 0; i < this.checked.length; i++){
    this.strArray.push(this.checked[i]);
    if(newStr.length<0){
      newStr = this.checked[i].id;
    }else{
      newStr = newStr +";"+this.checked[i].id;
    }
  }
  
  console.log(this.strArray);

  for (var i = 0; i < this.condition.length; i++){
    for (var j = 0; j < this.strArray.length; j++){
      if(this.condition[i].code == this.strArray[j].code){
       if((this.condition[i].new_ans).length==0) {
          this.condition[i].new_ans = this.strArray[j].value;
       }else{
          this.condition[i].new_ans = this.condition[i].new_ans +", " +this.strArray[j].value; 
       }
      }
    }
  }

  //console.log(this.condition);
  //console.log(newStr);
  //console.log(this.oldStr);

  /*
  if (newStr != this.oldStr) {
    console.log('mismatch found, so navigate to mismatch page');

    let navigationExtras: NavigationExtras = {
      state: {
        device: this.selCurrentDevice,
        data: this.condition
      }
    };
    
    this.router.navigate(['device-condition'], navigationExtras);
    
  }else {
    console.log('No mismatch found, so navigate to expected page with changeLocation Api Call');
  }
  */
    
  this.callVerifyProductApi(newStr);

  }

  callVerifyProductApi(newstr) {

    let postData = {
      "userName" : AppUserName,
      "apiKey" : AppApiKey,
      "returnCenterId" : localStorage.getItem("returnCenterId"),
      "conditionString" : newstr,
      "id" : this.strId
    }

    //console.log(postData);
    this.loader.showLoader(this.LangDict['Loading...']);

    this.rest.postRequest(verifyProductApi,postData).then((responseData) => {

      this.loader.dismissLoader();
      
      //console.log(JSON.parse(responseData['data']));
      //console.log("true==>"+JSON.stringify(JSON.parse(responseData['data'])));

      if (JSON.parse(responseData['data']).status == 'Success') {
        
        let resultData = JSON.parse(responseData['data']).msg;
        console.log(resultData);
        //let nowSTR = resultData.conditionString
        

        if (resultData.isMatched == 0) {
          
          // Navigate to mismatch page with whole data
          let navigationExtras: NavigationExtras = {
            state: {
              device: this.selCurrentDevice,
              data: this.condition,
              conditionString : newstr,
              //conditionString : nowSTR,
              itemID : this.strItemId,
              locationID : this.strLocationId,
              currentLocation : this.strCrLocation,
              isSearch : this.isSearch
            }
          };
          
          this.router.navigate(['device-condition'], navigationExtras);

        }else {
          
          // Call changeLocation api & Navigate to expected page

          this.callChangeLocationApi();
        }

      }else {
        this.alert.presentAlertOnView(this.LangDict['Error'],JSON.parse(responseData['data']).msg);
      }
    })
    .catch((error) => {
      this.alert.presentAlertOnView(this.LangDict['Error'],error);
    });

}

callChangeLocationApi() {

  let postData = {
    "userName" : AppUserName,
    "apiKey" : AppApiKey,
    "returnCenterId" : localStorage.getItem("returnCenterId"),
    "id" : this.strItemId,
    "currentLocation" : '1',
    "newLocation" : '4'
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

      let navigationExtras: NavigationExtras = {
        state: {
          user: this.strLocationId,
          pageTitle: this.strCrLocation,
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
