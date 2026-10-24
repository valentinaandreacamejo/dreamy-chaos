import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'DREAMY CHAOS FESTIVAL 2026',
  },
  { path: '**', redirectTo: '' },
];
