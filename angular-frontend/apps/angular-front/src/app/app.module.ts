import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializer } from 'src/utils/app-inits';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ManagerComponent } from './manager/manager.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { PostTwitterComponent } from './post-twitter/post-twitter.component';
import { PostInstagramComponent } from './post-instagram/post-instagram.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragDirective } from './drag.directive';
import { MatCardModule } from '@angular/material/card';
import { NgxTweetModule } from 'ngx-tweet';
import { DialogAnimationsExampleComponent } from './dialog-animations-example/dialog-animations-example.component';
import { MatDialogModule } from '@angular/material/dialog';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule, // add keycloakAngular module
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatCardModule,
    NgxTweetModule,
    MatDialogModule,
  ],
  providers: [
    // add this provider
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [KeycloakService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
