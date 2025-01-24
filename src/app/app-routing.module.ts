import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectsComponent } from './projects/projects.component';
import { ServicesComponent } from './services/services.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/:category', component: ProjectsComponent },
  { path: 'projects/:category/:subcategory', component: ProjectsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'services/:category', component: ServicesComponent },
  { path: 'services/:category/:subcategory', component: ServicesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => console.log(event));
  }
}
