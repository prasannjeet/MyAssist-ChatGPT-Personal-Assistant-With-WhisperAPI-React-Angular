import { Component } from '@angular/core';
import { FileHande } from '../file-hande.model';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogAnimationsExampleComponent } from '../dialog-animations-example/dialog-animations-example.component';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-post-twitter',
  templateUrl: './post-twitter.component.html',
  styleUrls: [
    '../assets/app/css/main.css',
    './post-twitter.component.scss',
    '../assets/twitter/css/style.css',
  ],
})
export class PostTwitterComponent {
  productImages: FileHande[] = [];
  tweet: string = '';
  tweetId: string;
  isSentTweet: boolean = false;
  accessToken: Promise<string>;
  client: HttpClient;
  fileBlob: string;

  constructor(
    public keycloakService: KeycloakService,
    http: HttpClient,
    public dialog: MatDialog
  ) {
    this.accessToken = this.keycloakService.getToken();
    this.client = http;
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DialogAnimationsExampleComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  onFileSelected(event: any) {
    console.log(event);
  }

  fileDropped(fileHandle: FileHande) {
    this.productImages.push(fileHandle);
    fileHandle.file.text().then((data) => {
      this.fileBlob = data;
      // console.log("fileBlob: " + this.fileBlob);
      // console.log("fileur: " + this.productImages[0].url)
    });
  }

  doTweet() {
    this.openDialog('500ms', '1500ms');

    if (this.productImages.length <= 0) {
      alert('Image must be selected');
      return;
    }

    if (
      this.productImages[0].file.size / 1024 / 1024 > 5 ||
      this.productImages[0].file.size <= 0
    ) {
      alert('Image size must be less than 5MB');
      return;
    }

    if (
      this.productImages[0].file.type !== 'image/jpeg' &&
      this.productImages[0].file.type !== 'image/png'
    ) {
      alert('Image must be jpeg or png');
      return;
    }

    if (this.tweet.length > 280 || this.tweet.length <= 0) {
      alert('Tweet must be less than 280 characters');
      return;
    }

    this.accessToken.then((token) => {
      const formData = new FormData();
      formData.append(
        'file',
        this.productImages[0].file,
        this.productImages[0].file.name
      );
      const params = new HttpParams().set('tweet', this.tweet);
      const requestHeader: HttpHeaders = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + token
      );
      // .set("Content-Type", "multipart/form-data");

      //Post tweet. If error, popup error message
      this.client
        .post(
          `${environment.tweetBackUrl}/twitter/tweet/tweet-image`,
          formData,
          {
            headers: requestHeader,
            params: params,
          }
        )
        .subscribe(
          (data) => {
            // console.log("data: " + data);

            // @ts-ignore
            if (data['error']) {
              // @ts-ignore
              alert(data['message']);
              return;
            }

            // if empty or null tweetid, popup error message
            // @ts-ignore
            if (!data['tweetId'] || data['tweetId'] === '') {
              alert(
                'Twett probably sent, but no tweetId returned. Please check your twitter account for confirmation.'
              );
              return;
            }

            // @ts-ignore
            this.tweetId = data['tweetId'];
            this.isSentTweet = true;
          },
          (error) => {
            alert(error.error.message);
          }
        );
    });
  }
}
