import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CategoryComponent } from './pages/category/category';
import { CommonModule } from '@angular/common'; 
import { WallpaperDetail } from './pages/wallpaper-detail/wallpaper-detail';
import { Favorites } from './pages/favorites/favorites';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'category/:category', component: CategoryComponent },
  { path: 'wallpaper/:id', component: WallpaperDetail },
  {path: 'favorites', component: Favorites}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
