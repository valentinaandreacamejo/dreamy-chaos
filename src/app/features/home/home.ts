import { Component } from '@angular/core';
import { Ticker } from '../../shared/components/ticker/ticker';
import { Contact } from './components/contact/contact';
import { Experience3d } from './components/experience-3d/experience-3d';
import { Hero } from './components/hero/hero';
import { LineupInteractive } from './components/lineup-interactive/lineup-interactive';
import { MerchSlider } from './components/merch-slider/merch-slider';
import { TicketGenerator } from './components/ticket-generator/ticket-generator';

@Component({
  selector: 'app-home',
  imports: [Hero, Ticker, LineupInteractive, Experience3d, TicketGenerator, MerchSlider, Contact],
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  protected readonly tickerItems = [
    '💥 3 DAYS OF UNCHECKED ENERGY',
    '🎧 50+ ARTISTS',
    '🌟 DIGITAL ART INSTALLATIONS',
    '🪩 BUY YOUR PASS NOW',
  ];
}
