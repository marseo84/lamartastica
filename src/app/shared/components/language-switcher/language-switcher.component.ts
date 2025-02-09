import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css',
  standalone: false,
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  selectedLanguage: string = '';
  private languageChangeSubscription: Subscription | undefined;

  constructor(private translate: TranslateService) {
    // this.translate.setDefaultLang('en');
    // this.translate.use('en');
  }

  ngOnInit(): void {
    this.selectedLanguage =
      this.translate.currentLang || this.translate.defaultLang;

    this.languageChangeSubscription = this.translate.onLangChange.subscribe(
      () => {
        this.selectedLanguage = this.translate.currentLang;
      }
    );
  }

  switchLanguage(language: string): void {
    this.selectedLanguage = language;
    // console.log(`Switching language to: ${language}`);
    this.translate.use(language);
    // console.log(`Current language: ${this.translate.currentLang}`);
  }

  ngOnDestroy(): void {
    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }
}
