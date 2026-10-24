import { Component, inject, signal } from '@angular/core';
import { AudioEngine } from '../../../core/services/audio';

@Component({
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
  host: {
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class Header {
  protected readonly audio = inject(AudioEngine);
  protected readonly menuOpen = signal(false);

  protected readonly links = [
    { label: 'LINEUP', href: '#lineup' },
    { label: 'EXPERIENCE', href: '#experience' },
    { label: 'TICKETS', href: '#tickets' },
    { label: 'MERCH', href: '#merch' },
  ];
}
