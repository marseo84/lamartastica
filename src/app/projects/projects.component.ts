import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChildren,
  ViewChild,
  QueryList,
  ElementRef,
  SimpleChanges,
  Input,
} from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilsService } from '../shared/services/utils.service';
import { Swiper } from 'swiper';
// import { log } from 'console';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  standalone: false,
})
export class ProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('swiperContainer') swiperElements!: QueryList<ElementRef>;
  @ViewChild('swiper') swiper!: Swiper;
  @Input() projects: any[] = [];

  isModalOpen = false;
  modalImage: string = '';
  modalTitle: string = '';

  category: string | null = null;
  subcategory: string | null = null;
  // projects: any[] = [];
  private languageSubscription!: Subscription;
  private swiperInstances: Swiper[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private translate: TranslateService,
    public utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category');
      this.subcategory = params.get('subcategory');
      this.loadProjects();
    });

    // React to language changes
    this.languageSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadProjects();
    });
  }

  ngAfterViewInit(): void {
    // initialize swiper after view has been initialized
    this.swiperElements.forEach((swiperEl) => {
      const swiper = new Swiper(swiperEl.nativeElement, {
        loop: true,
        spaceBetween: 20,
        speed: 800,
        navigation: true,
        pagination: { clickable: true },
      });

      this.swiperInstances.push(swiper);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] && this.swiper) {
      this.swiper.update();
    }
  }

  loadProjects(): void {
    if (this.category) {
      this.dataService
        .getProjects(this.category, this.subcategory)
        .subscribe((data) => {
          // this.projects =
          //   data.sort(
          //     (a: { order: number }, b: { order: number }) => a.order - b.order
          //   ) || [];
          // console.log(data);
          // console.log(this.category);
          // console.log(this.subcategory);

          // flatten the projects array based on subcategories and projectsWithoutSubcategory
          const subcategoryProjects =
            data.subcategories.flatMap((subcat: any) => subcat.projects) || [];
          // const noSubcategoryProjects = data.projectsWithoutSubcategory || [];
          const noSubcategoryProjects = data.projects || [];

          this.projects = [
            ...subcategoryProjects,
            ...noSubcategoryProjects,
          ].map((project: any, index: number) => ({
            ...project,
            uniqueId: `${this.category}-${this.subcategory || 'none'}-${index}`,
            media: project.media
              .filter((mediaItem: any) => mediaItem.src) // ignore media without src
              .map((mediaItem: any) => {
                if (
                  mediaItem.type === 'video' &&
                  // mediaItem.src &&
                  mediaItem.src?.includes('vimeo.com')
                ) {
                  return {
                    ...mediaItem,
                    id: this.utilsService.extractVimeoId(mediaItem.src),
                  };
                }
                return mediaItem; // keep images unmodified
              }),
          }));

          console.log(this.projects);
        });
    }
  }

  // swiper loop
  trackByFn(index: number, item: any): number {
    // return index;
    return item.id || item.uniqueId || index.toString();
  }

  openModal(src: string, title: string) {
    this.modalImage = src;
    this.modalTitle = title;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }

    this.swiperInstances.forEach((swiper) => {
      if (swiper) {
        swiper.destroy(true, true);
      }
    });

    this.swiperInstances = [];
  }
}
