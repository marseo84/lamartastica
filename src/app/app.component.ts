import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent {
  title = 'lamartastica';

  constructor(private translate: TranslateService) {
    // set the default language
    this.translate.setDefaultLang('en');

    // get the browser's language and ensure it is defined
    const browserLang = this.translate.getBrowserLang() || 'en';

    // validate the language and use a fallback if necessary
    this.translate.use(
      ['en', 'es', 'de', 'cz'].includes(browserLang) ? browserLang : 'en'
    );

    // subscribe to language change events
    this.translate.onLangChange.subscribe((event) => {
      console.log(`Language changed to: ${event.lang}`);
      // you can replace or extend this with additional logic, such as updating specific UI components or triggering re-fetching of data.
    });
  }
}
