import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../shared/services/data.service';
// import { HomeData } from '../shared/models/home.model';
import { trigger, style, animate, transition } from '@angular/animations';
// import { log } from 'console';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeSlideUp', [
      transition(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'translateY(4rem)',
            visibility: 'hidden',
          }), // Initially hidden
          animate(
            '{{delay}}ms ease-in',
            style({
              opacity: 1,
              transform: 'translateY(0)',
              visibility: 'visible',
            })
          ),
        ],
        { params: { delay: 500 } } // Default delay is 500ms
      ),
    ]),
  ],
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  homeData: any;
  private langChangeSubscription!: Subscription;

  constructor(
    private dataService: DataService,
    private translateService: TranslateService,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    // fetch initial home
    this.loadHomeData();

    // subscribe to language change events
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      () => {
        this.loadHomeData();
      }
    );
  }

  // loadHomeData(): void {
  //   this.dataService.getHome().subscribe({
  //     next: (data) => {
  //       this.homeData = data;
  //       console.log('Home data loaded:', data);
  //     },
  //     error: (error) => {
  //       console.error('Error loading home data:', error);
  //     },
  //     complete: () => {
  //       console.log('Home data loading complete.');
  //     },
  //   });
  // }

  loadHomeData(): void {
    forkJoin([this.dataService.getHome(), this.dataService.getMeta('home')]) // Use forkJoin
      .subscribe({
        next: ([homeData, metaData]) => {
          // Destructure the results
          this.homeData = homeData;

          // Set Meta Tags
          this.titleService.setTitle(metaData.title); //Set the title
          this.meta.updateTag({
            name: 'description',
            content: metaData.description,
          });
          this.meta.updateTag({ name: 'keywords', content: metaData.keywords });

          //Open graph tags
          this.meta.updateTag({
            property: 'og:title',
            content: metaData.title,
          });
          this.meta.updateTag({
            property: 'og:description',
            content: metaData.description,
          });
          // ... set other meta tags (og:image, twitter card, etc.)
          console.log('Home data loaded:', homeData);
          console.log('Meta data loaded:', metaData);
        },
        error: (error) => {
          console.error('Error loading home data:', error);
        },
        complete: () => {
          console.log('Home data loading complete.');
        },
      });
  }

  ngOnDestroy(): void {
    // unsubscribe to avoid memory leaks
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  getAnimationDelay(index: number): number {
    return 500 + index * 500;
  }

  onElementVisible(event: boolean): void {
    if (event) {
      console.log('Element is visible!');
      // Additional logic here
    }
  }
}
