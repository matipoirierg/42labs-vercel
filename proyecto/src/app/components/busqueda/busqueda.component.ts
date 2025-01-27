import { Component, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { CV } from '../../interfaces/cv.interface';
import { FiltroComponent } from '../filtro/filtro.component';

// Definir un enum para los estados de búsqueda
export enum SearchStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './busqueda.component.html',
})
export class BusquedaComponent {
  query: string = '';
  @Output() searchResults = new EventEmitter<{results: CV[], selectedRole: string | null}>();
  searchStatus: SearchStatus = SearchStatus.IDLE;
  @ViewChild(FiltroComponent) filtroComponent!: FiltroComponent;
  @Input() allCVs: CV[] = [];

  constructor(private searchService: SearchService) {}

  get isLoading(): boolean {
    return this.searchStatus === SearchStatus.LOADING;
  }

  handleSearch(event: Event): void {
    event.preventDefault();
    if (this.searchStatus === SearchStatus.LOADING) return;
    
    // Reset filters if filtroComponent is available
    if (this.filtroComponent) {
      this.filtroComponent.resetFilters();
    }
    
    if (this.query.trim()) {
      this.searchStatus = SearchStatus.LOADING;
      
      this.searchService.searchCVs(this.query).subscribe({
        next: (response) => {
          this.searchResults.emit({
            results: response.results,
            selectedRole: response.selectedRole
          });
          this.searchStatus = SearchStatus.SUCCESS;
        },
        error: (error) => {
          console.error('Error searching CVs:', error);
          this.searchStatus = SearchStatus.ERROR;
        }
      });
    }
  }

  handleClear(): void {
    this.query = '';
    this.searchStatus = SearchStatus.IDLE;
    this.searchResults.emit({
      results: this.allCVs,
      selectedRole: null
    });
  }
}
