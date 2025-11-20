import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { FormsModule } from '@angular/forms';

// Define Category type
interface Category {
  id: number;
  name: string;
  primary: string;
  secondary: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.html',
  styleUrls: ['./category.scss'],
  imports: [CommonModule, Navbar, FormsModule]
})
export class CategoryComponent implements OnInit, OnDestroy {
  wallpapers: any[] = [];
  filteredWallpapers: any[] = [];
  categoryName: string = '';
  theme = { primary: '#fff', secondary: '#eee' };
  searchListener: any;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
  this.route.params.subscribe(params => {
    this.categoryName = params['category'] || '';

    // Get wallpapers
    this.api.getWallpapersByCategory(this.categoryName).subscribe({
      next: (data) => {
        this.wallpapers = data;
        this.filteredWallpapers = [...data];
      }
    });

    // Get categories to determine theme
    this.api.getCategories().subscribe({
      next: (categories: Category[]) => {
        const cat = categories.find(c =>
          c.name?.toLowerCase() === this.categoryName.toLowerCase()
        );

        if (cat) {
          this.theme = { primary: cat.primary, secondary: cat.secondary };
        }
      }
    });
  });


    // 👂 Listen for search event from navbar
    this.searchListener = (event: any) => {
      const keyword = event.detail?.toLowerCase() || '';

      this.filteredWallpapers = this.wallpapers.filter(
        w =>
          w.title.toLowerCase().includes(keyword) ||
          w.category.toLowerCase().includes(keyword)
      );
    };

    window.addEventListener('search-wallpapers', this.searchListener);
  }

  ngOnDestroy() {
    window.removeEventListener('search-wallpapers', this.searchListener);
  }

  goToWallpaper(id: number) {
    this.router.navigate(['/wallpaper', id]);
  }
}
