import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AlertProvider } from 'src/Provider/Alert';
import { LoaderProvider } from 'src/Provider/Loader';
import { RestProvider } from 'src/Provider/Rest';
import { ActionSheetProvider } from 'src/Provider/ActionSheet';

import { environment } from 'src/environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

// geolocation and native-geocoder
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';



@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpClientModule
  ],
  providers: [
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy
    },
    AlertProvider,
    LoaderProvider,
    Geolocation,
    NativeGeocoder,
    HTTP,
    HttpClient,
    Network,
    RestProvider,
    ActionSheetProvider
  ],
  bootstrap: [
    AppComponent
  ],
})

export class AppModule {

  //AppUserName = 'ICReturnCenter';
  //AppApiKey = '7a8f1929a92334bb1555d25293919293';
  
}
