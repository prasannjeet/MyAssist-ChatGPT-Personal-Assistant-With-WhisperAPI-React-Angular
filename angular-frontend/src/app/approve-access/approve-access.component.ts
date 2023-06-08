import { Component } from "@angular/core";
import { NbMenuItem, NbOverlayService, NbSidebarService, NbToastrService } from "@nebular/theme";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { KeycloakService } from "keycloak-angular";
import { environment } from "../../environment/environment";

@Component({
  selector: "app-approve-access",
  templateUrl: "./approve-access.component.html",
  styleUrls: ["./approve-access.component.scss"]
})
export class ApproveAccessComponent {
  messages: any[];
  accessToken: Promise<string>;
  client: HttpClient;
  userId: any;
  isUserLoggedIn: Promise<boolean>;
  sidebarItems: NbMenuItem[] = [
    {
      title: "Home",
      link: "/",
      icon: "home-outline"
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
      selected: true
    }
  ];

  userData: User[] = [];

  constructor(private sidebarService: NbSidebarService, private toastrService: NbToastrService, private overlayService: NbOverlayService, public keycloakService: KeycloakService, http: HttpClient) {
    this.accessToken = this.keycloakService.getToken();
    this.client = http;
    this.userId = this.keycloakService.getKeycloakInstance().subject;
    this.isUserLoggedIn = this.keycloakService.isLoggedIn();
    this.getAllRequests();
  }

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  onToggleChanged(status: boolean, id: string) {
    if (status) {
      this.assignPermission(id);
    } else {
      this.revokePermission(id);
    }
  }

  assignPermission(id: string) {
    this.accessToken.then((token) => {
      const myHeaders: HttpHeaders = new HttpHeaders();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      this.client.post(`${environment.tweetBackUrl}/roles/assign?userId=${id}`, {
        headers: myHeaders
      }).subscribe(() => {
        this.toastrService.success(`The user has been granted access to Personal Assistant`, `Success`, { duration: 5000 });
      }, (error) => {
        this.toastrService.danger(`Error assigning role: ${error.statusText}. HTTP Status: ${error.status}`, `Error`, { duration: 5000 });
        this.userData.filter((user) => user.id === id).forEach((u) => {
          u.status = false;
        });
      });
    });
  }

  revokePermission(id: string) {
    this.accessToken.then((token) => {
      const myHeaders: HttpHeaders = new HttpHeaders();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      this.client.delete(`${environment.tweetBackUrl}/roles/assign?userId=${id}`, {
        headers: myHeaders
      }).subscribe(() => {
        this.toastrService.success(`Permission to the personal assistant has been revoked`, `Success`, { duration: 5000 });
      }, (error) => {
        this.toastrService.danger(`Error revoking role: ${error.statusText}. HTTP Status: ${error.status}`, `Error`, { duration: 5000 });
        this.userData.filter((user) => user.id === id).forEach((u) => {
          u.status = true;
        });
      });
    });
  }

  getAllRequests() {
    this.accessToken.then((token) => {
      const myHeaders: HttpHeaders = new HttpHeaders();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      this.client.get(`${environment.tweetBackUrl}/roles/all`, {
        headers: myHeaders
      }).subscribe((data) => {
        // @ts-ignore
        if (data["error"]) {
          // @ts-ignore
          this.toastrService.danger(data["message"], "Error", { duration: 5000 });
          return;
        }
        const dataArray = data as any[]; // cast data to an array
        if (Object.keys(data).length === 0) {
          return;
        }
        let userDataItems: User[] = [];
        dataArray.forEach((theData) => {
          let theStatus: boolean = theData.status === "APPROVED";
          let dataItem = {
            id: theData.id,
            username: theData.username,
            firstName: theData.firstName,
            lastName: theData.lastName,
            email: theData.email,
            status: theStatus,
          };
          userDataItems.push(dataItem);
        });
        this.userData = userDataItems;
      }, (error) => {
        this.toastrService.danger(error.error.message, "Error", { duration: 5000 });
      });
    });
  };

  logout() {
    this.keycloakService.logout(`${environment.appUrl}`).then(() => {
    });
  }

}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
}
