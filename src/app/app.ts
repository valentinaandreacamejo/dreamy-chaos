import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PointerTracker } from './core/services/pointer';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  constructor() {
    // Start tracking early so --pointer-x/y are available app-wide
    inject(PointerTracker);
  }
}
