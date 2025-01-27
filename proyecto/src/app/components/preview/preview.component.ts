import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CV } from '../../interfaces/cv.interface';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matVerified } from '@ng-icons/material-icons/baseline';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIcon
  ],
  viewProviders: [provideIcons({ matVerified })],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent {
  // Input para recibir el CV
  @Input() cv: CV | null = null;

  // Output para cerrar el popup
  @Output() onClose = new EventEmitter<void>();

  // Output para editar el CV
  @Output() onEdit = new EventEmitter<CV>();

  // Output para cambiar la verificación del CV
  @Output() onVerificationChange = new EventEmitter<CV>();

  isEditing = false;
  editForm: CV | null = null;
  showSuccessMessage = false;

  constructor(private dbService: DbService) {}

  startEditing(): void {
    if (this.cv) {
      this.editForm = { ...this.cv };
      this.isEditing = true;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editForm = null;
  }

  saveChanges(): void {
    if (this.editForm && this.cv) {
      this.dbService.updateCV(this.cv.id, this.editForm).subscribe({
        next: (updatedCV) => {
          this.cv = updatedCV;
          this.onEdit.emit(updatedCV);
          this.isEditing = false;
          this.editForm = null;
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000); // La notificación desaparecerá después de 3 segundos
        },
        error: (error) => console.error('Error updating CV:', error)
      });
    }
  }

  toggleVerification(): void {
    if (this.cv) {
      this.dbService.toggleVerification(this.cv.id).subscribe({
        next: (response) => {
          // Actualizar el CV local con la respuesta completa
          this.cv = response.item;
          // Emitir el CV actualizado
          this.onVerificationChange.emit(response.item);
        },
        error: (error) => console.error('Error toggling verification:', error)
      });
    }
  }

  addEducation(): void {
    if (this.editForm) {
      this.editForm.educacion.push({
        titulo: '',
        institucion: '',
        fechaInicio: '',
        fechaFin: ''
      });
    }
  }

  addExperience(): void {
    if (this.editForm) {
      this.editForm.experienciaLaboral.push({
        puesto: '',
        empresa: '',
        fechaInicio: '',
        fechaFin: '',
        descripcion: ''
      });
    }
  }

  addCertification(): void {
    if (this.editForm) {
      this.editForm.certificaciones.push({
        nombre: '',
        emisor: '',
        fecha: ''
      });
    }
  }
}
