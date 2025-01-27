import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../services/upload.service';

interface QueuedFile {
  file: File;
  status: 'pendiente' | 'procesando' | 'completado' | 'error';
  error?: string;
}

@Component({
  selector: 'app-subida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subida.component.html',
  styleUrls: ['./subida.component.css']
})
export class SubidaComponent {
  fileQueue: QueuedFile[] = [];
  isProcessing = false;

  constructor(private uploadService: UploadService) {}

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files).map(file => ({
        file,
        status: 'pendiente' as const
      }));
      this.fileQueue.push(...newFiles);
      input.value = ''; // Resetear input para permitir seleccionar el mismo archivo
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    const pendingFile = this.fileQueue.find(f => f.status === 'pendiente');
    if (!pendingFile) return;

    this.isProcessing = true;
    pendingFile.status = 'procesando';

    this.uploadService.uploadCV(pendingFile.file).subscribe({
      next: () => {
        pendingFile.status = 'completado';
        this.isProcessing = false;
        this.processQueue(); // Procesar siguiente archivo
      },
      error: (error) => {
        pendingFile.status = 'error';
        pendingFile.error = error.message || 'Error al subir el archivo.';
        this.isProcessing = false;
        this.processQueue();
      }
    });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remover el prefijo "data:mime/type;base64," del string
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  }

  removeFromQueue(index: number): void {
    this.fileQueue.splice(index, 1);
  }
}