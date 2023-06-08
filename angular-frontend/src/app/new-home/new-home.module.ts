import { RouterModule } from "@angular/router"; // we also need angular router for Nebular to function properly
import {
  NbSidebarModule,
  NbLayoutModule,
  NbButtonModule,
  NbLayoutComponent,
  NbLayoutColumnComponent,
  NbSidebarComponent, NbMenuModule, NbThemeModule, NbIconModule, NbAccordionModule, NbAccordionComponent
} from "@nebular/theme";
import { NgModule } from "@angular/core";

@NgModule({
  imports: [
    RouterModule, // RouterModule.forRoot(routes, { useHash: true }), if this is your app.module
    NbLayoutModule,
    NbSidebarModule, // NbSidebarModule.forRoot(), //if this is your app.module
    NbButtonModule,
    NbMenuModule,
    NbThemeModule,
    NbIconModule,
    NbAccordionModule
  ],
  declarations: [
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbSidebarComponent,
    NbAccordionComponent
  ],
})

export class NewHomeModule {

}
