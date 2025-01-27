import { Routes } from '@angular/router';
import { SubidaComponent } from './components/subida/subida.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'upload',
    component: SubidaComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full'
  }
];
