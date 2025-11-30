import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[fileDrop]'
})
export class FileDropDirective {
  @Output() fileDropped = new EventEmitter<File>();

  @HostListener("dragover", ["$event"])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener("drop", ["$event"])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.fileDropped.emit(file);
    }
  }
}
