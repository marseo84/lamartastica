import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-language-switcher',
    templateUrl: './language-switcher.component.html',
    styleUrl: './language-switcher.component.css',
    standalone: false
})
export class LanguageSwitcherComponent {
  selectedLanguage = 'en';

  constructor(private translate: TranslateService) {
    // this.translate.setDefaultLang('en');
    // this.translate.use('en');
  }

  switchLanguage(language: string): void {
    this.selectedLanguage = language;
    console.log(`Switching language to: ${language}`);
    this.translate.use(language);
    console.log(`Current language: ${this.translate.currentLang}`);
  }
}
