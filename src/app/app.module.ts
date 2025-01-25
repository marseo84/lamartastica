import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  InjectionToken,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NestedTranslateLoader } from './shared/services/nested-translate-loader';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectsComponent } from './projects/projects.component';
import { ServicesComponent } from './services/services.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LanguageSwitcherComponent } from './shared/components/language-switcher/language-switcher.component';
import { UtilsService } from './shared/services/utils.service';
import { VimeoPlayerComponent } from './shared/components/vimeo-player/vimeo-player.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { InViewportDirective } from './directives/in-viewport.directive';

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

// define Injection Tokens for 'prefix' and 'suffix'
export const PREFIX = new InjectionToken<string>('prefix');
export const SUFFIX = new InjectionToken<string>('suffix');

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
// }

export function HttpLoaderFactory(
  http: HttpClient,
  prefix: string,
  suffix: string
): NestedTranslateLoader {
  return new NestedTranslateLoader(http, prefix, suffix);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ProjectsComponent,
    ServicesComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LanguageSwitcherComponent,
    VimeoPlayerComponent,
    ThankYouComponent,
    InViewportDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, PREFIX, SUFFIX],
      },
    }),
  ],
  providers: [
    // provideClientHydration(),
    // provideHttpClient(),
    {
      provide: PREFIX,
      useValue: '/assets/i18n/',
    },
    {
      provide: SUFFIX,
      useValue: '.json',
    },
    // UtilsService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
