import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
// import { map, catchError } from 'rxjs'; // rxjs/operators
import { TranslateService } from '@ngx-translate/core';
import { ProjectCategory } from '../models/projects-category.model';
import { ServiceCategory } from '../models/service-category.model';

// import { ChangeDetectorRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private translate: TranslateService) {}

  private getCurrentLanguage(): string {
    return this.translate.currentLang || this.translate.getDefaultLang();
  }

  // general function to fetch JSON files dynamically
  private fetchJSON<T>(path: string): Observable<T> {
    const language = this.getCurrentLanguage();
    return this.http.get<T>(`/assets/i18n/${language}/${path}.json`);
  }

  getHome(): Observable<any> {
    return this.fetchJSON<any>('home').pipe(
      map((data) => ({
        hero: data.HERO || {},
        body: data.BODY || {},
        cta: data.CTA || {},
      }))
    );
  }

  getAbout(): Observable<any> {
    return this.fetchJSON<any>('about').pipe(
      map((data) => ({
        hero: data.HERO || {},
        body: data.BODY || {},
        cta: data.CTA || {},
        sections: (data.BODY.SECTIONS || []).map((section: any) => ({
          heading: section.HEADING,
          text: section.TEXT || [],
          list: section.LIST || {},
          quote: section.QUOTE || {},
        })),
      }))
    );
  }

  getContact(): Observable<any> {
    return this.fetchJSON<any>('contact').pipe(
      map((data) => ({
        TITLE: data.TITLE || '', // Use uppercase key
        DESCRIPTION: {
          LINE_1: data.DESCRIPTION?.LINE_1 || '',
          LINE_2: data.DESCRIPTION?.LINE_2 || '',
        },
        FORM: {
          NAME: {
            LABEL: data.FORM?.NAME?.LABEL || '',
            PLACEHOLDER: data.FORM?.NAME?.PLACEHOLDER || '',
            REQUIRED_ERROR: data.FORM?.NAME?.REQUIRED_ERROR || '',
          },
          EMAIL: {
            LABEL: data.FORM?.EMAIL?.LABEL || '',
            PLACEHOLDER: data.FORM?.EMAIL?.PLACEHOLDER || '',
            REQUIRED_ERROR: data.FORM?.EMAIL?.REQUIRED_ERROR || '',
          },
          MESSAGE: {
            LABEL: data.FORM?.MESSAGE?.LABEL || '',
            PLACEHOLDER: data.FORM?.MESSAGE?.PLACEHOLDER || '',
            REQUIRED_ERROR: data.FORM?.MESSAGE?.REQUIRED_ERROR || '',
          },
          SUBMIT_BUTTON: data.FORM?.SUBMIT_BUTTON || '',
        },
        CONTACT_INFO: {
          EMAIL_LABEL: data.CONTACT_INFO?.EMAIL_LABEL || '',
          EMAIL: data.CONTACT_INFO?.EMAIL || '',
          TEL_LABEL: data.CONTACT_INFO?.TEL_LABEL || '',
          TEL: data.CONTACT_INFO?.TEL || '',
        },
      }))
    );
  }

  getProjects(category: string, subcategory: string | null): Observable<any> {
    const language = this.getCurrentLanguage();

    return this.http
      .get<ProjectCategory>(`/assets/data/projects-${language}.json`)
      .pipe(
        map((data: any) => {
          // Find the category
          const categoryData = data.categories.find(
            (c: any) => c.slug === category
          );
          console.log(category);
          console.log(categoryData);
          if (!categoryData) {
            console.warn(`Category '${category}' not found.`);
            return { projects: [], subcategories: [] };
          }

          if (subcategory) {
            // If a subcategory is specified, find it
            const subcategoryData = categoryData.subcategories?.find(
              (sc: any) => sc.slug === subcategory
            );

            if (!subcategoryData) {
              console.warn(
                `Subcategory '${subcategory}' not found in category '${category}'.`
              );
              return { projects: [], subcategories: [] };
            }

            return {
              projects: subcategoryData.projects || [],
              subcategories: [], // No nested subcategories in this context
            };
          }

          // If no subcategory, include top-level projects
          const projects = [
            ...(categoryData.projects || []),
            ...(categoryData.projectsWithoutSubcategory || []),
          ];

          return {
            projects,
            subcategories: categoryData.subcategories || [],
          };
        }),
        catchError((error) => {
          console.error('Error fetching projects:', error);
          return of({ projects: [], subcategories: [] });
        })
      );
  }

  getServices(category: string): Observable<any> {
    const language =
      this.translate.currentLang || this.translate.getDefaultLang();
    return this.http
      .get<ServiceCategory>(`/assets/data/services-${language}.json`)
      .pipe(map((data: ServiceCategory) => data[category] || []));
  }

  getMeta(page: string): Observable<any> {
    return this.fetchJSON<any>('meta').pipe(map((data) => data[page] || {}));
  }
}
