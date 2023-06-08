import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { AdminComponent } from "./admin/admin.component";
import { AuthGuard } from "./auth/auth.guard";
import { ManagerComponent } from "./manager/manager.component";
import { PostTwitterComponent } from "./post-twitter/post-twitter.component";
import { PostInstagramComponent } from "./post-instagram/post-instagram.component";
import { ChatGPTComponent } from "./chat-gpt/chat-gpt.component";
import { ApproveAccessComponent } from "./approve-access/approve-access.component";
import { NewHomeComponent } from "./new-home/new-home.component";
import { NewAccessDeniedComponent } from "./new-access-denied/new-access-denied.component";

const routes: Routes = [
  {
    path: '',
    component: NewHomeComponent,
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'denied',
    component: NewAccessDeniedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'twitter',
    component: PostTwitterComponent,
    canActivate: [AuthGuard],
    data: { roles: ['hastwitter'] }
  },
  {
    path: 'instagram',
    component: PostInstagramComponent,
    canActivate: [AuthGuard],
    data: { roles: ['hasfacebook'] }
  },
  {
    path: 'assistant',
    component: ChatGPTComponent,
    canActivate: [AuthGuard],
    data: { roles: ['openapi'] }
  },
  {
    path: 'approve',
    component: ApproveAccessComponent,
    canActivate: [AuthGuard],
    data: { roles: ['role-assigner'] }
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    // The user need to have this roles to access
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['developer'] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


