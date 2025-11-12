import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss']
})
export class Modal {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() width = '400px';
  @Input() isOpen = false;

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
    this.isOpen = false;
  }

  close() {
    this.onClose.emit();
    this.isOpen = false;
  }
}
