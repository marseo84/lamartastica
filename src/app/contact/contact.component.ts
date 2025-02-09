import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: false,
})
export class ContactComponent implements OnInit, OnDestroy {
  contactData: any;
  contactForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private langChangeSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private translationService: TranslateService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadContactData();

    // this.translationService.onLangChange
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.loadContactData();
    //   });

    this.langChangeSubscription =
      this.translationService.onLangChange.subscribe(() => {
        this.loadContactData();
      });
  }

  loadContactData(): void {
    this.dataService.getContact().subscribe({
      next: (data) => {
        this.contactData = data;
        console.log('Contact data loaded: ', data);
      },
      error: (error) => {
        console.error('Error loading contact data:', error);
      },
      complete: () => {
        console.log('Home data loading complete.');
      },
    });
  }

  // loadContactData(): void {
  //   this.dataService
  //     .getContact()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (data) => {
  //         this.contactData = data;
  //         console.log('Contact data loaded: ', data);
  //       },
  //       error: (error) => {
  //         console.error('Error loading contact data:', error);
  //       },
  //       complete: () => {
  //         console.log('Contact data loading complete.');
  //       },
  //     });
  // }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // const body = {
    //   name: this.contactForm.value.name,
    //   email: this.contactForm.value.email,
    //   message: this.contactForm.value.message,
    // };

    const body = this.contactForm.value;

    // this.http
    //   .post('https://formspree.io/f/meoqbkdn', body, { headers })
    //   .subscribe(
    //     (response: any) => {
    //       console.log('Form submitted successfully', response);
    //       this.contactForm.reset();
    //       this.router.navigate(['/thank-you']);
    //     },
    //     (error: any) => {
    //       console.error('Form submission error', error);
    //     }
    //   );

    this.http
      .post('https://formspree.io/f/meoqbkdn', body, { headers })
      .pipe(takeUntil(this.destroy$)) // Unsubscribe from the HTTP request
      .subscribe({
        next: (response: any) => {
          console.log('Form submitted successfully', response);
          this.contactForm.reset();
          this.router.navigate(['/thank-you']);
        },
        error: (error: any) => {
          console.error('Form submission error', error);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
