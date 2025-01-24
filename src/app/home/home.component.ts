import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../shared/services/data.service';
// import { HomeData } from '../shared/models/home.model';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeSlideUp', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(4rem)',
          visibility: 'hidden',
        }), // Initially hidden
        animate(
          '500ms ease-in',
          style({
            opacity: 1,
            transform: 'translateY(0)',
            visibility: 'visible',
          })
        ), // Visible after animation
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  homeData: any; // holds the translated content
  private langChangeSubscription!: Subscription;

  constructor(
    private dataService: DataService,
    private translateService: TranslateService
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

  loadHomeData(): void {
    this.dataService.getHome().subscribe({
      next: (data) => {
        this.homeData = data;
        console.log('Home data loaded:', data);
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
}
