import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './guards/auth.guard';
import { ApiService } from './services/api.service';
import { CameraService } from './camera.service';
import { NetworkService } from './services/network.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SQLite, AuthGuard, ApiService, CameraService, NetworkService],
  bootstrap: [AppComponent],
})
export class AppModule {}
