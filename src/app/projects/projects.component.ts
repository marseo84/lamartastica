import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  category: string | null = null;
  subcategory: string | null = null;
  projects: any[] = [];
  private languageSubscription!: Subscription;

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

  loadProjects(): void {
    if (this.category) {
      this.dataService
        .getProjects(this.category, this.subcategory)
        .subscribe((data) => {
          // this.projects =
          //   data.sort(
          //     (a: { order: number }, b: { order: number }) => a.order - b.order
          //   ) || [];
          console.log(data);
          console.log(this.category);
          console.log(this.subcategory);

          // flatten the projects array based on subcategories and projectsWithoutSubcategory
          const subcategoryProjects =
            data.subcategories.flatMap((subcat: any) => subcat.projects) || [];
          // const noSubcategoryProjects = data.projectsWithoutSubcategory || [];
          const noSubcategoryProjects = data.projects || [];

          this.projects = [
            ...subcategoryProjects,
            ...noSubcategoryProjects,
          ].map((project: any) => ({
            ...project,
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
    return index; // Or a unique ID from your project
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }
}
