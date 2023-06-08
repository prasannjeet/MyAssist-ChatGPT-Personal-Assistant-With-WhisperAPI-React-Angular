import { Component } from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import { environment } from "../../environment/environment";

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: [
    './access-denied.component.scss',
    '../assets/app/css/main.css',
    '../assets/app/css/util.css',
    '../assets/app/fonts/font-awesome-4.7.0/css/font-awesome.min.css',
    '../assets/app/vendor/animate/animate.css',
    '../assets/app/vendor/bootstrap/css/bootstrap.min.css',
    '../assets/app/vendor/select2/select2.min.css'
  ]
})
export class AccessDeniedComponent {
  title = 'SocialFlow';
  isUserLoggedIn: Promise<boolean>;
  isUserTwitter: boolean;
  isUserFacebook: boolean;
  constructor(public keycloakService: KeycloakService) {
    this.isUserLoggedIn = this.keycloakService.isLoggedIn();
    this.isUserTwitter = this.keycloakService.isUserInRole("hastwitter");
    this.isUserFacebook = this.keycloakService.isUserInRole("hasfacebook");
    console.log("isUserTwitter: " + this.isUserTwitter);
    console.log("isUserFacebook: " + this.isUserFacebook);
  }
  logout() {
    this.keycloakService.logout(`${environment.appUrl}`).then(() => {
      console.log("logged out");
    });
  }
}
