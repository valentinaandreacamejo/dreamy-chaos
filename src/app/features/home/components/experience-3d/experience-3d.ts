import { Component, computed, inject } from '@angular/core';
import { PointerTracker } from '../../../../core/services/pointer';

@Component({
  selector: 'app-experience',
  styleUrl: './experience-3d.scss',
  templateUrl: './experience-3d.html',
})
export class Experience3d {
  private readonly pointer = inject(PointerTracker);

  // Whole scene rotates with the cursor; faces sit in a 3D carousel.
  protected readonly sceneTransform = computed(
    () => `rotateX(${-this.pointer.y() * 12}deg) rotateY(${this.pointer.x() * 24}deg)`,
  );

  // TODO: swap for Three.js / WebGL canvas if a richer scene is needed
  protected readonly faces = ['LIGHT', 'SOUND', 'DREAM', 'CHAOS', 'LOVE', 'NOISE'];
}
