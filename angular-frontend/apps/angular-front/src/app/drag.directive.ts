import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';
import { FileHande } from './file-hande.model';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appDrag]',
})
export class DragDirective {
  dropCounter = 0;

  @Output() files: EventEmitter<FileHande> = new EventEmitter<FileHande>();

  @HostBinding('style.background-color') private background = '#f5fcff';

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('dragover', ['$event'])
  public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
  }

  @HostListener('drop', ['$event'])
  public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    let fileHandle: FileHande;
    // @ts-ignore
    const file: File = evt.dataTransfer.files[0];
    const url = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );

    fileHandle = {
      file: file,
      url: url,
    };

    this.files.emit(fileHandle);
    this.dropCounter++;
  }
}
