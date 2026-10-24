import { Component, inject, signal } from '@angular/core';
import { ASSETS } from '../../../../core/festival';
import { AudioEngine } from '../../../../core/services/audio';
import { DraggableSticker } from '../../../../shared/components/draggable-sticker/draggable-sticker';

@Component({
  selector: 'app-contact',
  imports: [DraggableSticker],
  styleUrl: './contact.scss',
  templateUrl: './contact.html',
})
export class Contact {
  private readonly audio = inject(AudioEngine);

  protected readonly smiley = ASSETS.stickers.smileyFlower;
  protected readonly starburst = ASSETS.stickers.starburst;
  protected readonly subscribed = signal(false);

  // TODO: connect to a real newsletter endpoint
  protected subscribe(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    this.subscribed.set(true);
    this.audio.blip(1200, 0.2, 'triangle');
  }
}
