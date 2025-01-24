import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  category: string | null = '';
  services: any[] = []; // replace with your actual service data

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category');
      this.loadServices();
    });
  }

  loadServices(): void {
    if (this.category) {
      this.services = this.getServicesByCategory(this.category);
    } else {
      this.services = this.getAllServices();
    }
  }

  getAllServices(): any[] {
    return [
      { title: 'Motion Graphics Design', category: 'motion-graphics' },
      { title: 'Web Design', category: 'web-design' },
      // Add more services as needed
    ];
  }

  getServicesByCategory(category: string): any[] {
    return this.getAllServices().filter(
      (service) => service.category === category
    );
  }
}
