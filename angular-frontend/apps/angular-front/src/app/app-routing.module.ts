import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth/auth.guard';
import { ManagerComponent } from './manager/manager.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PostTwitterComponent } from './post-twitter/post-twitter.component';
import { PostInstagramComponent } from './post-instagram/post-instagram.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'twitter',
    component: PostTwitterComponent,
    canActivate: [AuthGuard],
    data: { roles: ['hastwitter'] },
  },
  {
    path: 'instagram',
    component: PostInstagramComponent,
    canActivate: [AuthGuard],
    data: { roles: ['hasfacebook'] },
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
