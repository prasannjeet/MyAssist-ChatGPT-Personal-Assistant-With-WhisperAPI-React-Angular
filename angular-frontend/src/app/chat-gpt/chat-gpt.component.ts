import { Component } from "@angular/core";
import { NbMenuItem, NbOverlayService, NbSidebarService, NbToastrService } from "@nebular/theme";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { KeycloakService } from "keycloak-angular";
import { environment } from "../../environment/environment";

@Component({
  selector: "app-chat-gpt",
  templateUrl: "./chat-gpt.component.html",
  styleUrls: ["./chat-gpt.component.scss"]
})

export class ChatGPTComponent {
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
      icon: "settings-2-outline",
      selected: true
    },
    {
      title: "Approve Access",
      link: "/approve",
      icon: "edit-2-outline",
    }
  ];


  constructor(private sidebarService: NbSidebarService, private toastrService: NbToastrService, private overlayService: NbOverlayService, public keycloakService: KeycloakService, http: HttpClient) {
    let files;
    let items = [{
      text: "Hello, how can I help you?",
      date: new Date(),
      reply: true,
      type: "text",
      files: files,
      user: {
        name: "Jonh Doe",
        avatar: "https://i.gifer.com/no.gif"
      }
    }];
    this.messages = items;
    this.accessToken = this.keycloakService.getToken();
    this.client = http;
    this.userId = this.keycloakService.getKeycloakInstance().subject;
    this.isUserLoggedIn = this.keycloakService.isLoggedIn();
    this.getConversation();
  }

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  logout() {
    this.keycloakService.logout(`${environment.appUrl}`).then(() => {
    });
  }

  sendRequest(promptItem: string): Promise<any> {
    if (promptItem === null || promptItem === undefined || promptItem === "") {
      return Promise.resolve("");
    }


    return this.accessToken.then((token) => {
      const myHeaders: HttpHeaders = new HttpHeaders();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      let params = new HttpParams();
      params = params.append("prompt", promptItem);

      return new Promise((resolve, reject) => {
        this.client.post(`${environment.tweetBackUrl}/autocomplete/completion`, {
          headers: myHeaders
        }, { params }).subscribe((data) => {
          const messageItem: any = data;
          let theUser = {
            name: "Assistant",
            avatar: "https://cdn2.iconfinder.com/data/icons/boxicons-solid-vol-1/24/bxs-bot-512.png"
          };

          let newVar = {
            text: messageItem.content.trim(),
            date: Date.now(),
            reply: false,
            type: "text",
            user: theUser
          };
          resolve(newVar);
        }, (error) => {
          reject(error);
        });
      });
    });
  };

  getConversation() {
    this.accessToken.then((token) => {
      const myHeaders: HttpHeaders = new HttpHeaders();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      this.client.get(`${environment.tweetBackUrl}/autocomplete/allmessages`, {
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

        let allMessages: any[] = [];
        dataArray.forEach((messageItem: any) => {
          let isReply = messageItem.author === this.userId;
          let theUser;
          if (isReply) {
            theUser = {
              name: this.keycloakService.getUsername(),
              avatar: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"
            };
          } else {
            theUser = {
              name: "Assistant",
              avatar: "https://cdn2.iconfinder.com/data/icons/boxicons-solid-vol-1/24/bxs-bot-512.png"
            };
          }

          let message = {
            text: messageItem.text,
            date: messageItem.createdAt,
            reply: isReply,
            type: "text",
            user: theUser
          };
          allMessages.push(message);
        });

        this.messages = allMessages;

      }, (error) => {
        this.toastrService.danger(error.error.message, "Error", { duration: 5000 });
      });

    });

  };

  sendMessage(event: any) {

    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      type: "text",
      user: {
        name: this.keycloakService.getUsername(),
        avatar: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"
      }
    });

    this.sendRequest(event.message).then((message) => {
      let botReply = true;
      if (message === null || message === undefined || message === "") {
        botReply = false;
      }
      if (botReply) {
        setTimeout(() => {
          this.messages.push(message);
        }, 1500);
      }
    });
  }
}
