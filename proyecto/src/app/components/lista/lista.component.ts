import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from '../preview/preview.component';
import { FiltroComponent, Filters } from '../filtro/filtro.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matDownload } from '@ng-icons/material-icons/baseline';
import { matArticle } from '@ng-icons/material-icons/baseline';
import { matRemoveRedEye } from '@ng-icons/material-icons/baseline';
import { DbService } from '../../services/db.service';
import { CV } from '../../interfaces/cv.interface';
import { SignedurlService } from '../../services/signedurl.service';
import { firstValueFrom } from 'rxjs';

type ValidRoles = keyof CV['puntajes'];

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, PreviewComponent, NgIcon, FiltroComponent],
  viewProviders: [provideIcons({ matDownload, matArticle, matRemoveRedEye })],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  private _cvs: CV[] = [];
  filteredCVs: CV[] = [];
  selectedCV: CV | null = null;
  showPreview = false;
  showList: boolean = true;
  downloading: {[key: string]: boolean} = {};
  selectedRole: string | null = null;
  
  // Agregar variables para paginación
  currentPage: number = 1;
  itemsPerPage: number = 20;
  
  // Getter para obtener los CVs de la página actual
  get paginatedCVs(): CV[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCVs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Getter para el número total de páginas
  get totalPages(): number {
    return Math.ceil(this.filteredCVs.length / this.itemsPerPage);
  }

  // Método para cambiar de página
  changePage(page: number): void {
    this.currentPage = page;
  }

  @Input() set cvs(value: CV[]) {
    this._cvs = value;
    this.filteredCVs = value;
    this.currentPage = 1;
  }
  get cvs(): CV[] {
    return this._cvs;
  }

  constructor(private dbService: DbService, private signedUrlService: SignedurlService) {}

  ngOnInit(): void {
    this.loadCVs();
  }

  loadCVs(): void {
    this.dbService.getCVs().subscribe({
      next: (cvs) => {
        const sortedCVs = cvs.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this._cvs = [...sortedCVs];
        this.filteredCVs = [...sortedCVs];
        this.cvs = [...sortedCVs];
      },
      error: (error) => {
        console.error('Error loading CVs:', error);
      }
    });
  }

  handlePreview(id: string): void {
    this.dbService.getCV(id).subscribe({
      next: (cv) => {
        this.selectedCV = cv;
        this.showPreview = true;
      },
      error: (error) => console.error('Error loading CV:', error)
    });
  }

  handleClosePreview(): void {
    this.showPreview = false;
    this.selectedCV = null;
  }

  handleEditCV(updatedCV: CV): void {
    // Actualizar tanto el array original como el filtrado
    this._cvs = this._cvs.map(cv => 
      cv.id === updatedCV.id ? updatedCV : cv
    );
    
    this.filteredCVs = this.filteredCVs.map(cv => 
      cv.id === updatedCV.id ? updatedCV : cv
    );
  }

  async handleViewOriginal(s3Key: string) {
    try {
      const response = await firstValueFrom(this.signedUrlService.getSignedUrl(s3Key));
      if (response && response.signedUrl) {
        window.open(response.signedUrl, '_blank');
      } else {
        console.error('No se recibió una URL firmada válida');
        // You might want to show a user-friendly error message here
      }
    } catch (error) {
      console.error('Error al obtener la URL firmada:', error);
      // You might want to show a user-friendly error message here
    }
  }

  handleDownload(id: string): void {
    const cv = this.filteredCVs.find(cv => cv.id === id);
    if (!cv) {
      console.error('CV not found');
      return;
    }

    this.downloading[id] = true;
    this.dbService.generatePDF(cv).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV-${cv.informacionPersonal.nombre}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading CV:', error);
      },
      complete: () => {
        this.downloading[id] = false;
      }
    });
  }

  handleFiltersChanged(filteredResults: CV[]): void {
    this.filteredCVs = filteredResults;
    this.currentPage = 1; // Resetear a la primera página cuando se filtran resultados
  }

  handleSearchResults(data: {results: CV[], selectedRole: string | null}): void {
    this.selectedRole = data.selectedRole;
    
    if (data.selectedRole) {
      // Si hay un rol seleccionado, ordenar por puntaje
      this.filteredCVs = data.results.sort((a, b) => {
        const scoreA = a.puntajes[data.selectedRole as keyof typeof a.puntajes] || 0;
        const scoreB = b.puntajes[data.selectedRole as keyof typeof b.puntajes] || 0;
        return scoreB - scoreA;  // Orden descendente
      });
    } else {
      // Si no hay rol, mantener el orden por fecha
      this.filteredCVs = data.results;
    }
    
    this.currentPage = 1;
  }

  getScore(cv: CV): number | null {
    if (!this.selectedRole || !cv.puntajes) return null;
    return cv.puntajes[this.selectedRole as keyof typeof cv.puntajes];
  }

  handleVerificationChange(updatedCV: CV): void {
    // Actualizar el CV en la lista local
    this.filteredCVs = this.filteredCVs.map(cv => 
      cv.id === updatedCV.id ? updatedCV : cv
    );
    this._cvs = this._cvs.map(cv => 
      cv.id === updatedCV.id ? updatedCV : cv
    );
  }
}