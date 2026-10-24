import { Component, inject, signal } from '@angular/core';
import { AudioEngine } from '../../../../core/services/audio';
import { PassExporter } from '../../../../core/services/pass-exporter';
import { TICKET_TIERS, TicketStore, TicketTier } from '../../../../core/services/ticket';
import { TicketPass3d } from '../../../../shared/components/ticket-pass-3d/ticket-pass-3d';

@Component({
  selector: 'app-ticket-generator',
  imports: [TicketPass3d],
  styleUrl: './ticket-generator.scss',
  templateUrl: './ticket-generator.html',
})
export class TicketGenerator {
  protected readonly ticket = inject(TicketStore);
  private readonly exporter = inject(PassExporter);
  private readonly audio = inject(AudioEngine);

  protected readonly tiers = TICKET_TIERS;
  protected readonly flipped = signal(false);
  protected readonly saving = signal(false);

  protected setName(value: string): void {
    this.ticket.holder.set(value);
    this.audio.blip(300 + value.length * 40, 0.03);
  }

  protected setTier(value: string): void {
    this.ticket.tier.set(value as TicketTier);
    this.flipped.set(false);
    this.audio.blip(880, 0.12, 'sawtooth');
  }

  protected async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.exporter.download({
        holder: this.ticket.displayName(),
        tier: this.ticket.tier(),
        code: this.ticket.code(),
        color: this.ticket.color(),
        perk: this.ticket.info().perk,
      });
    } finally {
      this.saving.set(false);
    }
  }
}
