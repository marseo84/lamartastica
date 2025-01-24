import { Injectable, Inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Optionally, you can provide the service globally by using 'root'
})
export class NestedTranslateLoader implements TranslateLoader {
  private filesToLoad: string[] = ['ux', 'about']; // Default files you want to load

  constructor(
    private http: HttpClient,
    @Inject('PREFIX') private prefix: string,
    @Inject('SUFFIX') private suffix: string
  ) {}

  getTranslation(lang: string): Observable<any> {
    // Dynamically load the requested files (e.g., ux, about)
    const requests = this.filesToLoad.map((file) =>
      this.http.get(`${this.prefix}${lang}/${file}${this.suffix}`)
    );

    return forkJoin(requests).pipe(
      map((responses) => {
        console.log('Loaded translations:', responses);
        // merge all responses into a single object
        return responses.reduce(
          (acc, translation) => ({ ...acc, ...translation }),
          {}
        );
      })
    );
  }

  // Optional method to update which files to load (you can call this dynamically if needed)
  setFiles(files: string[]): void {
    this.filesToLoad = files;
  }
}
