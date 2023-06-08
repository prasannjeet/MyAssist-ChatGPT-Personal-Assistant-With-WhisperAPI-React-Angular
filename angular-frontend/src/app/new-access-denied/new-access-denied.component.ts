import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NbMenuItem, NbOverlayService, NbSidebarService, NbToastrService } from "@nebular/theme";
import { KeycloakService } from "keycloak-angular";
import { environment } from "../../environment/environment";

@Component({
  selector: 'app-new-access-denied',
  templateUrl: './new-access-denied.component.html',
  styleUrls: ['./new-access-denied.component.scss']
})
export class NewAccessDeniedComponent {
  accessToken: Promise<string>;
  client: HttpClient;
  userId: any;
  isUserLoggedIn: Promise<boolean>;
  sidebarItems: NbMenuItem[] = [
    {
      title: "Home",
      link: "/",
      icon: "home-outline",
    },
    {
      title: "Assistant",
      link: "/assistant",
      icon: "settings-2-outline"
    },
    {
      title: "Approve Access",
      link: "/approve",
      icon: "edit-2-outline",
    }
  ];

  accessRequestLabels: AccessData = {
    heading: "Request Access to the Assistant",
    content: "Would you like to try the Assistant? Request access to the Assistant by clicking the button below.",
    buttonLabel: "Request Access",
    currentStatus: "You have not requested access to the Assistant.",
    isButtonActive: true
  }

  constructor(private sidebarService: NbSidebarService, private toastrService: NbToastrService, private overlayService: NbOverlayService, public keycloakService: KeycloakService, http: HttpClient) {
    this.accessToken = this.keycloakService.getToken();
    this.client = http;
    this.userId = this.keycloakService.getKeycloakInstance().subject;
    this.isUserLoggedIn = this.keycloakService.isLoggedIn();
    this.checkRequestStatus().then((data) => {
      console.log("The data is: " + data);
      this.accessRequestLabels = data;
    });
  }

  requestAccess() {
    this.accessToken.then((token) => {
      const myHeaders: HttpHeaders = new HttpHeaders();
      myHeaders.append("Authorization", `Bearer ${token}`);
        this.client.post(`${environment.tweetBackUrl}/roles/request`, {
          headers: myHeaders
        }).subscribe((data) => {
          this.toastrService.success(
            `Your request has been submitted.`,
            `Success`,
            { duration: 5000 }
          );
          this.accessRequestLabels.buttonLabel = "Already Requested";
          this.accessRequestLabels.currentStatus = "You have already requested access to the Assistant.";
          this.accessRequestLabels.isButtonActive = false;
        }, (error) => {
          this.toastrService.danger(
            `Error fetching your current status: ${error.statusText}. HTTP Status: ${error.status}`,
            `Error`,
            { duration: 5000 }
          );
        });
    });
  }

  checkRequestStatus(): Promise<AccessData> {
    console.log("Checking the request status");
    return this.accessToken.then((token) => {
      const myHeaders: HttpHeaders = new HttpHeaders();
      myHeaders.append("Authorization", `Bearer ${token}`);
      // response type must be plaintext
      myHeaders.append("Accept", "text/plain");

      return new Promise((resolve, reject) => {
        this.client.get(`${environment.tweetBackUrl}/roles/status`, {
          headers: myHeaders,
          responseType: "text"
        }).subscribe((data) => {
          console.log("The data is: " + data);
          const messageItem: any = data;
          const status: string = messageItem;

          console.log("The status is: " + status);

          let newLabels: AccessData = {
            heading: "Request Access to the Assistant",
            content: "Would you like to try the Assistant? Request access to the Assistant by clicking the button below.",
            buttonLabel: "Request Access",
            currentStatus: "You have not requested access to the Assistant."
          }

          if (status === "APPROVED") {
            newLabels.buttonLabel = "Already Requested";
            newLabels.currentStatus = "You have been approved. Please refresh the Assistant page to try it out.";
            newLabels.isButtonActive = false;
          } else if (status === "PENDING") {
            newLabels.buttonLabel = "Already Requested";
            newLabels.currentStatus = "Your request is pending. Check back later.";
            newLabels.isButtonActive = false;
          } else if (status === "REJECTED") {
            newLabels.buttonLabel = "Already Requested";
            newLabels.currentStatus = "Your request was rejected. Check back later.";
            newLabels.isButtonActive = false;
          } else {
            newLabels.isButtonActive = true;
          }

          resolve(newLabels);
        }, (error) => {
          console.log("The error is: ");
          console.log(error.error.error);
          this.toastrService.danger(`Error fetching your current status: ${error.statusText}. HTTP Status: ${error.status}`, `Error`, { duration: 5000 });
          reject(error);
        });
      });
    });
  }

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  logout() {
    this.keycloakService.logout(`${environment.appUrl}`).then(() => {
      console.log("logged out");
    });
  }
}

interface AccessData {
  heading: string;
  content: string;
  buttonLabel: string;
  currentStatus: string;
  isButtonActive?: boolean;
}
