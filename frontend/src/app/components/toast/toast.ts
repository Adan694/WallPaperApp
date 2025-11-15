import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss']
})
export class Toast {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';

  dismiss() {
    this.message = '';
  }
}
