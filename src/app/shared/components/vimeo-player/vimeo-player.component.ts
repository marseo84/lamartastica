import {
  Component,
  Input,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-vimeo-player',
    templateUrl: './vimeo-player.component.html',
    styleUrls: ['./vimeo-player.component.css'],
    standalone: false
})
export class VimeoPlayerComponent implements AfterViewInit {
  // @Input() videoId!: string;
  @Input() jsonData: any = {};
  @Input() autoplay: boolean = false;
  @Input() loop: boolean = false;
  @Input() muted: boolean = false;
  @Input() controls: boolean = true;
  @Input() responsive: boolean = true;
  @Input() color: string = '#FF5733';
  @Input() title: boolean = false;
  @Input() byline: boolean = false;
  @Input() portrait: boolean = false;
  @Input() texttrack: string = 'en';

  videoIds: string[] = []; // To store extracted video IDs
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(platformId); // Check if running in the browser
  }

  ngOnInit(): void {
    if (this.jsonData.type === 'video' && this.jsonData.src) {
      const videoId = this.getVideoIdFromUrl(this.jsonData.src);
      if (videoId) this.videoIds.push(videoId);
    }
    console.log('VideoIds length: ', this.videoIds.length);
    console.log('VideoIds: ', this.videoIds);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || this.videoIds.length === 0) {
      console.warn(
        'Vimeo players not initialized due to invalid environment or data.'
      );
      return;
    }

    import('@vimeo/player')
      .then(({ default: Player }) => {
        this.videoIds.forEach((videoId, index) => {
          const playerId = `vimeo-player-${videoId}-${index}`;
          const videoElement = document.getElementById(playerId);

          if (videoElement) {
            const options = {
              id: videoId,
              autoplay: this.autoplay,
              loop: this.loop,
              muted: this.muted,
              responsive: true,
              title: false,
              byline: false,
              portrait: false,
              controls: true,
            };

            const player = new Player(videoElement, options);

            // Optional event listeners
            player.on('play', () =>
              console.log(`Video ${videoId} started playing.`)
            );
            player.on('pause', () => console.log(`Video ${videoId} paused.`));
            player.on('ended', () =>
              console.log(`Video ${videoId} playback ended.`)
            );
          } else {
            console.error(`No video element found for video ID ${videoId}`);
          }
        });
      })
      .catch((error) => {
        console.error('Error loading Vimeo Player:', error);
      });
  }

  /**
   * Extracts all video IDs from the JSON data.
   */
  private extractVideoIds(data: any): void {
    const videoIds: string[] = [];

    const traverseMedia = (mediaArray: any[]) => {
      mediaArray.forEach((media) => {
        if (media.type === 'video' && media.src) {
          const videoId = this.getVideoIdFromUrl(media.src);
          if (videoId) videoIds.push(videoId);
        }
      });
    };

    // Traverse categories, subcategories, and projects
    data.categories?.forEach((category: any) => {
      category.subcategories?.forEach((subcategory: any) => {
        subcategory.projects?.forEach((project: any) => {
          traverseMedia(project.media);
        });
      });
      category.projectsWithoutSubcategory?.forEach((project: any) => {
        traverseMedia(project.media);
      });
    });

    this.videoIds = videoIds; // Assign to the component's state
  }

  /**
   * Extracts Vimeo video ID from the full URL.
   */
  private getVideoIdFromUrl(url: string): string | null {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  }
}
