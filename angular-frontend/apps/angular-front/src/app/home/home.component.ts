import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss',
    '../assets/app/css/main.css',
    '../assets/app/css/util.css',
    '../assets/app/fonts/font-awesome-4.7.0/css/font-awesome.min.css',
    '../assets/app/vendor/animate/animate.css',
    '../assets/app/vendor/bootstrap/css/bootstrap.min.css',
    '../assets/app/vendor/select2/select2.min.css',
  ],
})
export class HomeComponent {
  title = 'SocialFlow';
  isUserLoggedIn: Promise<boolean>;
  isUserTwitter: boolean;
  isUserFacebook: boolean;
  client: HttpClient;
  accessToken: Promise<string>;

  constructor(public keycloakService: KeycloakService, http: HttpClient) {
    this.isUserLoggedIn = this.keycloakService.isLoggedIn();
    this.isUserTwitter = this.keycloakService.isUserInRole('hastwitter');
    this.isUserFacebook = this.keycloakService.isUserInRole('hasfacebook');
    this.client = http;
    this.accessToken = this.keycloakService.getToken();
    console.log('isUserTwitter: ' + this.isUserTwitter);
    console.log('isUserFacebook: ' + this.isUserFacebook);
  }
  logout() {
    this.keycloakService.logout('http://localhost:4200').then(() => {
      console.log('logged out');
    });
  }

  testRequest() {
    this.accessToken.then((token) => {
      const requestHeader: HttpHeaders = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + token
      );
      // add header inline
      // let h: string = "Authorization: Bearer " + token;
      // let hd: string[] = [h];
      this.client
        .get(`${environment.tweetBackUrl}/users/status/check`, {
          headers: requestHeader,
        })
        .subscribe((data) => {
          console.log('data: ' + data);
        });
    });
  }
}
