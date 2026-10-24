import { Component, computed, inject, signal } from '@angular/core';
import { ASSETS } from '../../../../core/festival';
import { AudioEngine } from '../../../../core/services/audio';

export type Stage = 'CHAOS STAGE' | 'DREAMY ARENA' | 'ACID TENT';
type StageFilter = Stage | 'ALL STAGES';

export interface Artist {
  name: string;
  stage: Stage;
  day: 'FRI' | 'SAT' | 'SUN';
  time: string;
  genre: string;
  accent: 'fuchsia' | 'acid-yellow';
  headliner?: boolean;
}

interface StageInfo {
  name: StageFilter;
  tagline: string;
  hue: number;
}

@Component({
  selector: 'app-lineup-interactive',
  styleUrl: './lineup-interactive.scss',
  templateUrl: './lineup-interactive.html',
})
export class LineupInteractive {
  private readonly audio = inject(AudioEngine);

  protected readonly stageImage = ASSETS.images.stage;
  protected readonly crowdImage = ASSETS.images.crowd;

  // `hue` tints the featured photo per stage (CSS hue-rotate)
  protected readonly stages: readonly StageInfo[] = [
    { name: 'ALL STAGES', tagline: '3 STAGES · 50+ ARTISTS · 72H NON-STOP', hue: 0 },
    { name: 'CHAOS STAGE', tagline: 'MAIN STAGE · LASER CATHEDRAL', hue: 0 },
    { name: 'DREAMY ARENA', tagline: 'OPEN-AIR · SUNSET TO SUNRISE', hue: 200 },
    { name: 'ACID TENT', tagline: 'UNDERGROUND · 303 ONLY', hue: 70 },
  ];

  // TODO: move to a data service / JSON
  protected readonly artists: readonly Artist[] = [
    { name: 'NEON KAWAII', stage: 'CHAOS STAGE', day: 'FRI', time: '23:40', genre: 'HYPERPOP', accent: 'fuchsia', headliner: true },
    { name: 'GLITTER DAEMON', stage: 'ACID TENT', day: 'FRI', time: '01:15', genre: 'ACID TECHNO', accent: 'acid-yellow' },
    { name: 'SOFT ERROR', stage: 'DREAMY ARENA', day: 'FRI', time: '20:30', genre: 'DREAM POP', accent: 'fuchsia' },
    { name: 'LIQUID MOM', stage: 'CHAOS STAGE', day: 'SAT', time: '22:30', genre: 'EUROTRANCE', accent: 'acid-yellow', headliner: true },
    { name: 'Y2KILL', stage: 'ACID TENT', day: 'SAT', time: '02:00', genre: 'HARDGROOVE', accent: 'fuchsia' },
    { name: 'BUBBLEGUM CRISIS', stage: 'DREAMY ARENA', day: 'SAT', time: '19:00', genre: 'J-CORE', accent: 'acid-yellow' },
    { name: 'CHROME ANGEL', stage: 'CHAOS STAGE', day: 'SUN', time: '23:00', genre: 'DIGICORE', accent: 'fuchsia', headliner: true },
    { name: 'TAMAGOTCHI WAR', stage: 'ACID TENT', day: 'SUN', time: '01:30', genre: 'BREAKCORE', accent: 'acid-yellow' },
    { name: 'SAD BUT RAVE', stage: 'DREAMY ARENA', day: 'SUN', time: '21:15', genre: 'EMO TRANCE', accent: 'fuchsia' },
  ];

  protected readonly activeStage = signal<StageFilter>('ALL STAGES');
  protected readonly hovered = signal<Artist | null>(null);
  /** Cursor position inside the grid, for the floating preview. */
  protected readonly cursor = signal({ x: 0, y: 0 });

  protected readonly filtered = computed(() => {
    const stage = this.activeStage();
    return stage === 'ALL STAGES' ? this.artists : this.artists.filter((a) => a.stage === stage);
  });

  protected readonly featured = computed(() => this.stages.find((s) => s.name === this.activeStage())!);

  protected selectStage(stage: StageFilter): void {
    this.activeStage.set(stage);
    this.audio.blip(740);
  }

  protected onGridMove(event: PointerEvent, grid: HTMLElement): void {
    const rect = grid.getBoundingClientRect();
    this.cursor.set({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  protected onCardEnter(artist: Artist): void {
    this.hovered.set(artist);
    this.audio.blip(artist.accent === 'fuchsia' ? 600 : 900, 0.05);
  }
}
