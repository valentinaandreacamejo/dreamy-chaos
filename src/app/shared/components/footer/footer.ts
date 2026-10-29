import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FESTIVAL_START } from '../../../core/festival';

const DAY = 86_400_000;

@Component({
  selector: 'app-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  private readonly now = signal(Date.now());

  protected readonly daysLeft = computed(() => Math.max(0, Math.ceil((FESTIVAL_START.getTime() - this.now()) / DAY)));

  // TODO: real profile URLs
  protected readonly socials = [
    { label: 'INSTAGRAM', href: '#' },
    { label: 'TIKTOK', href: '#' },
    { label: 'SPOTIFY', href: '#' },
    { label: 'DISCORD', href: '#' },
  ];

  constructor() {
    const id = setInterval(() => this.now.set(Date.now()), 60_000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
