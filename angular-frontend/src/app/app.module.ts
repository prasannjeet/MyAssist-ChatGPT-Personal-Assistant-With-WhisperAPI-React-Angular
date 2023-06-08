import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializer } from 'src/utils/app-inits';
import {AccessDeniedComponent} from "./access-denied/access-denied.component";
import {ManagerComponent} from "./manager/manager.component";
import {AdminComponent} from "./admin/admin.component";
import { HomeComponent } from './home/home.component';
import { PostTwitterComponent } from './post-twitter/post-twitter.component';
import { PostInstagramComponent } from './post-instagram/post-instagram.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import { DragDirective } from './drag.directive';
import {MatCardModule} from "@angular/material/card";
import {NgxTweetModule} from "ngx-tweet";
import { DialogAnimationsExampleComponent } from './dialog-animations-example/dialog-animations-example.component';
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";
import {
  NbAccordionModule,
  NbButtonModule, NbCardModule,
  NbChatModule, NbCheckboxModule, NbIconModule,
  NbLayoutModule, NbListModule,
  NbMenuModule,
  NbSidebarModule, NbTableModule,
  NbThemeModule,
  NbToastrModule, NbToggleModule
} from "@nebular/theme";
import { ChatGPTComponent } from "./chat-gpt/chat-gpt.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { ApproveAccessComponent } from './approve-access/approve-access.component';
import { NewHomeComponent } from './new-home/new-home.component';
import { NewAccessDeniedComponent } from './new-access-denied/new-access-denied.component';


@NgModule({
  declarations: [
    AppComponent,
    AccessDeniedComponent,
    ManagerComponent,
    AdminComponent,
    HomeComponent,
    PostTwitterComponent,
    PostInstagramComponent,
    DragDirective,
    DialogAnimationsExampleComponent,
    ChatGPTComponent,
    ApproveAccessComponent,
    NewHomeComponent,
    NewAccessDeniedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule, // add keycloakAngular module
    HttpClientModule, BrowserAnimationsModule, FormsModule, MatToolbarModule, MatFormFieldModule, MatCardModule,
    NgxTweetModule, MatDialogModule,
    NbChatModule.forRoot({ messageGoogleMapKey: "AIzaSyA21jY_Duhpd9We2h-ngMHri79ridaXwt8" }),
    NbToastrModule.forRoot(), NbThemeModule.forRoot(), NbLayoutModule, NbSidebarModule.forRoot(), NbMenuModule.forRoot(), MatButtonToggleModule, NbButtonModule,
    NbEvaIconsModule, NbTableModule, NbCardModule, NbListModule, NbCheckboxModule, NbToggleModule, NbAccordionModule, NbIconModule
  ],
  providers: [
    // add this provider
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [KeycloakService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
// @ts-ignore
export class AppModule {
}
