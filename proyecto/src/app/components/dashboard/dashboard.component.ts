import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusquedaComponent } from '../busqueda/busqueda.component';
import { ListaComponent } from '../lista/lista.component';
import { CV } from '../../interfaces/cv.interface';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BusquedaComponent, ListaComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cvs: CV[] = [];
  @ViewChild('lista') listaComponent!: ListaComponent;

  constructor(private dbService: DbService) {}

  ngOnInit() {
    this.loadInitialCVs();
  }

  loadInitialCVs() {
    this.dbService.getCVs().subscribe({
      next: (cvs) => {
        // Ordenar CVs por fecha de subida (más reciente primero)
        this.cvs = cvs.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.listaComponent?.handleSearchResults({
          results: this.cvs,
          selectedRole: null
        });
      },
      error: (error) => console.error('Error loading CVs:', error)
    });
  }

  handleSearchResults(data: {results: CV[], selectedRole: string | null}): void {
    if (data.selectedRole === null) {
      // Si es una limpieza, cargar todos los CVs de nuevo
      this.loadInitialCVs();
      this.listaComponent.handleSearchResults({
        results: this.cvs,
        selectedRole: null
      });
    } else {
      this.listaComponent.handleSearchResults(data);
    }
  }
}
