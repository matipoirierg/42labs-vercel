import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CV } from '../../interfaces/cv.interface';

export interface Filters {
  name: string;
  experience: string[];
  skills: string[];
  verified: boolean;
}

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent {
  @Output() filtersChanged = new EventEmitter<CV[]>();
  @Input() cvs: CV[] = [];

  filters: Filters = {
    name: '',
    experience: [],
    skills: [],
    verified: false
  };

  handleFilterChange(key: string, value: string | string[]): void {
    this.filters = { ...this.filters, [key]: value };
    this.applyFilters();
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      experience: [],
      skills: [],
      verified: false
    };
    this.filtersChanged.emit(this.cvs);
  }

  private applyFilters(): void {
    let results = [...this.cvs];
    
    results = this.applySearchFilters(results);
    results = this.applySorting(results);

    this.filtersChanged.emit(results);
  }

  private applySearchFilters(cvs: CV[]): CV[] {
    if (!this.hasActiveFilters()) {
      return cvs;
    }

    return cvs.filter(cv => 
      this.matchesNameFilter(cv) && 
      this.matchesExperienceFilter(cv) && 
      this.matchesSkillsFilter(cv) &&
      this.matchesVerifiedFilter(cv)
    );
  }

  private hasActiveFilters(): boolean {
    return !!(this.filters.name || 
              this.filters.experience.length || 
              this.filters.skills.length ||
              this.filters.verified);
  }

  private matchesNameFilter(cv: CV): boolean {
    if (!this.filters.name) return true;
    
    return cv.informacionPersonal.nombre.toLowerCase()
      .includes(this.filters.name.toLowerCase());
  }

  private matchesExperienceFilter(cv: CV): boolean {
    if (!this.filters.experience.length) return true;

    const years = cv.resumen.anos_experiencia;
    return this.filters.experience.some(range => {
      const ranges: Record<string, boolean> = {
        '0-2': years >= 0 && years <= 2,
        '3-5': years >= 3 && years <= 5,
        '6-10': years >= 6 && years <= 10,
        '10+': years > 10
      };
      return ranges[range] || false;
    });
  }

  private matchesSkillsFilter(cv: CV): boolean {
    if (!this.filters.skills.length) return true;

    const cvSkills = cv.habilidades.toLowerCase().split(',').map(s => s.trim());
    return this.filters.skills.every(skill => 
      cvSkills.some(cvSkill => cvSkill.includes(skill.toLowerCase()))
    );
  }

  private matchesVerifiedFilter(cv: CV): boolean {
    return !this.filters.verified || cv.verificado;
  }

  private applySorting(cvs: CV[]): CV[] {
    return [...cvs].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  updateCheckboxArray(array: string[], value: string, isChecked: boolean): string[] {
    return isChecked ? [...array, value] : array.filter(item => item !== value);
  }
}