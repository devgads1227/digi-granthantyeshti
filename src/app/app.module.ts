import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './features/landing/landing.component';
import { DisposalComponent } from './features/disposal/disposal.component';
import { AboutComponent } from './features/about/about.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    DisposalComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
