import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserAuth } from '../../services/user-auth';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-like-button',
  template: `
    <div class="like-wrapper" (click)="toggleLike()">
      <i
        class="bi"
        [class.bi-heart-fill]="hasLiked"
        [class.bi-heart]="!hasLiked"
        [class.liked]="hasLiked"
      ></i>
      <span class="likes-count">{{ likesCount }}</span>
      <span class="ripple" *ngIf="rippleActive"></span>
    </div>
  `,
  styles: [`
    .like-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      position: relative;
      user-select: none;
      transition: transform 0.2s ease;
    }

    .like-wrapper:hover {
      transform: scale(1.15);
    }

    .like-wrapper i {
      font-size: 1.6rem;
      color: #aaa;
      transition: color 0.3s, transform 0.3s;
    }

    .like-wrapper i.liked {
      color: #ff4d6d;
      transform: scale(1.4) rotate(-10deg);
    }

    .likes-count {
      font-weight: 600;
      font-size: 0.95rem;
      color: #333;
      transition: transform 0.25s;
    }

    .like-wrapper i.liked + .likes-count {
      transform: scale(1.2);
    }

    /* Ripple effect */
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,77,109,0.3);
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      animation: ripple 0.5s ease-out;
      pointer-events: none;
    }

    @keyframes ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
  `],
  imports: [CommonModule]
})
export class LikeButton implements OnChanges {
  @Input() wallpaperId!: number;
  @Input() likes: string[] | null | string = [];

  normalizedLikes: string[] = [];
  rippleActive = false;

  constructor(private auth: UserAuth, private api: ApiService) {}

  ngOnChanges() {
  this.normalizedLikes = this.normalizeLikes(this.likes);
  console.log('likes input:', this.likes, 'normalizedLikes:', this.normalizedLikes);
}

private normalizeLikes(likes: string[] | string | null | undefined): string[] {
  if (!likes) return [];
  if (Array.isArray(likes)) return likes;
  if (typeof likes === 'string') {
    try { return JSON.parse(likes); } catch { return [likes]; }
  }
  return [];
}

  get hasLiked(): boolean {
    const user = this.auth.getUser();
    return user?.email ? this.normalizedLikes.includes(user.email) : false;
  }

  get likesCount(): number {
    return this.normalizedLikes.length;
  }

  toggleLike() {
    const user = this.auth.getUser();
    if (!user?.email) {
      alert('Please login to like this wallpaper');
      return;
    }

    this.rippleActive = true;
    setTimeout(() => this.rippleActive = false, 500); // show ripple briefly

    if (this.hasLiked) {
      this.api.unlikeWallpaper(this.wallpaperId, user.email).subscribe({
        next: () => this.normalizedLikes = this.normalizedLikes.filter(e => e !== user.email),
        error: err => console.error('Error unliking wallpaper', err)
      });
    } else {
      this.api.likeWallpaper(this.wallpaperId, user.email).subscribe({
        next: () => this.normalizedLikes = [...this.normalizedLikes, user.email],
        error: err => console.error('Error liking wallpaper', err)
      });
    }
  }
}
