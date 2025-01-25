import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
// import { IntersectionObserverEntry } from '@angular/cdk/observers';
// import { IntersectionObserver } from '@angular/cdk/observers';

@Directive({
  selector: '[appInViewport]',
  standalone: false,
})
export class InViewportDirective implements AfterViewInit, OnDestroy {
  @Output() visible = new EventEmitter<boolean>();
  private observer: IntersectionObserver | null = null;

  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Emit visibility state
        this.visible.emit(entry.isIntersecting);
      });
    });

    if (this.element.nativeElement) {
      this.observer.observe(this.element.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
