import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  // get vimeo id
  public extractVimeoId(url: string): string {
    const match = /vimeo\.com\/(\d+)/.exec(url);
    console.log('Vimeo ID match:', match);
    return match ? match[1] : ''; // Return the matched ID or an empty string
  }
}
