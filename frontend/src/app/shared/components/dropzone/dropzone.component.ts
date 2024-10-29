import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent {
  @Input() control!: FormControl;
  @Input() multiple: boolean = false;
  @Input() acceptedTypes: string = ''; 
  @Input() disabled: boolean = false;

  @Output() fileDropped = new EventEmitter<FileList>();

  files: File[] = [];
  filePreviews: { type: string, preview: string | null, fileName: string }[] = []; 

  // Método para tratar arquivos arrastados para a área
  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (!this.disabled && event.dataTransfer?.files.length) {
      const fileList = event.dataTransfer.files;
      this.handleFileSelection(fileList);
    }
  }

  // Método para tratar seleção manual de arquivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.handleFileSelection(input.files);
    }
  }

  // Lógica para lidar com seleção de arquivos
  private handleFileSelection(fileList: FileList) {
    const filesArray = Array.from(fileList);
    if (!this.multiple) {
      this.files = [filesArray[0]]; 
    } else {
      this.files.push(...filesArray);
    }
    this.control.setValue(this.files);
    this.fileDropped.emit(fileList);

    // Gerar pré-visualizações
    this.generateFilePreviews(this.files);
  }

  // Gera pré-visualizações dependendo do tipo de arquivo
  private generateFilePreviews(files: File[]) {
    this.filePreviews = [];
    files.forEach(file => {
      const fileType = file.type;
      if (fileType.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreviews.push({ type: 'image', preview: e.target.result, fileName: file.name });
        };
        reader.readAsDataURL(file);
      } else if (fileType === 'application/pdf') {
        this.filePreviews.push({ type: 'pdf', preview: null, fileName: file.name });
      } else {
        this.filePreviews.push({ type: 'other', preview: null, fileName: file.name });
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }
}
