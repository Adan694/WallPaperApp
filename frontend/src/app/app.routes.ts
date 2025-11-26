import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CategoryComponent } from './pages/category/category';
import { CommonModule } from '@angular/common'; 
import { WallpaperDetail } from './pages/wallpaper-detail/wallpaper-detail';
import { Favorites } from './pages/favorites/favorites';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminWallpapers } from './pages/admin-wallpapers/admin-wallpapers';
import { AdminUsers } from './pages/admin-users/admin-users';
import { AdminCategories } from './pages/admin-categories/admin-categories';
import { LoginComponent } from './pages/user-login/user-login';
import { Settings } from './pages/settings/settings';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'category/:category', component: CategoryComponent },
  { path: 'wallpaper/:id', component: WallpaperDetail },
  { path: 'favorites', component: Favorites },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin/dashboard', component: AdminDashboard },
  { path: 'admin/wallpapers', component: AdminWallpapers },
  { path: 'admin/users', component: AdminUsers },
{ path: 'admin/categories', component: AdminCategories },
  { path: 'login', component: LoginComponent },
    { path: 'admin/settings', component: Settings },


];
