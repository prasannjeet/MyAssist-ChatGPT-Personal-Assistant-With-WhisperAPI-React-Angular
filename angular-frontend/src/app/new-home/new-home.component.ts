import { ChangeDetectionStrategy, Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NbMenuItem, NbOverlayService, NbSidebarService, NbToastrService } from "@nebular/theme";
import { KeycloakService } from "keycloak-angular";
import { environment } from "../../environment/environment";

@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.component.html',
  styleUrls: ['./new-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewHomeComponent {
  accessToken: Promise<string>;
  client: HttpClient;
  userId: any;
  isUserLoggedIn: Promise<boolean>;
  sidebarItems: NbMenuItem[] = [
    {
      title: "Home",
      link: "/",
      icon: "home-outline",
      selected: true
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

  constructor(private sidebarService: NbSidebarService, private toastrService: NbToastrService, private overlayService: NbOverlayService, public keycloakService: KeycloakService, http: HttpClient) {
    this.accessToken = this.keycloakService.getToken();
    this.client = http;
    this.userId = this.keycloakService.getKeycloakInstance().subject;
    this.isUserLoggedIn = this.keycloakService.isLoggedIn();
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
