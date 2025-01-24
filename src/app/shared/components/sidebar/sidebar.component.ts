import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    standalone: false
})
export class SidebarComponent {
  isSidebarOpen = false;

  constructor(private router: Router, private translate: TranslateService) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidbar() {
    this.isSidebarOpen = false;
  }

  // close the sidebar when navigation occurs
  ngOnInit() {
    this.router.events.subscribe(() => {
      this.closeSidbar();
    });
  }
}
