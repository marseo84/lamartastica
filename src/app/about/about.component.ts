import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../shared/services/data.service';
// import { NestedTranslateLoader } from '../shared/services/nested-translate-loader';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit, OnDestroy {
  aboutData: any;
  private languageChangeSubscription!: Subscription;

  constructor(
    private dataService: DataService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    // fetch initial about
    this.loadAboutData();

    // subscribe to language change events
    this.languageChangeSubscription =
      this.translateService.onLangChange.subscribe(() => {
        this.loadAboutData();
      });
  }

  loadAboutData(): void {
    this.dataService.getAbout().subscribe({
      next: (data) => {
        this.aboutData = data;
        console.log('About data loaded:', data);
      },
      error: (error) => {
        console.error('Error loading about data:', error);
      },
      complete: () => {
        console.log('About data loading complete.');
      },
    });
  }

  ngOnDestroy(): void {
    // unsubscribe to avoid memory leaks
    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }
}

// export class AboutComponent implements OnInit {
//   constructor(
//     private translate: TranslateService,
//     private nestedLoader: NestedTranslateLoader
//   ) {
//     // this.loadTranslations();
//     console.log('AboutComponent constructor');
//   }

//   ngOnInit(): void {
//     console.log('AboutComponent initialized');

//     // set the translation files dynamically for this component
//     this.nestedLoader.setFiles(['ux', 'about']);

//     // reload the current language to fetch and apply the newly set translation files
//     this.translate.reloadLang(this.translate.currentLang).subscribe(() => {
//       console.log(`Translations reloaded for ${this.translate.currentLang}`);
//     });
//   }

//   // private loadTranslations() {
//   //   // get the current language set in the TranslateService
//   //   const currentLang =
//   //     this.translate.currentLang || this.translate.defaultLang;

//   //   // Dynamically update which files to load (e.g., 'ux', 'about', etc.)
//   //   const files = this.nestedLoader.setFiles(['ux', 'about']);

//   //   // Use the dynamic loader to fetch the translations
//   //   this.translate.get('*', { lang: currentLang }).subscribe((translations) => {
//   //     console.log(translations); // The merged translations from ux.json and about.json
//   //   });
//   // }
// }
