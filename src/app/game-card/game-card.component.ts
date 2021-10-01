import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cartas } from './shared/game-card.model';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css'],
  animations: [
    trigger('virarCarta', [
      state('normal', style({
        transform: 'none'
      })),
      state('virado', style({
        transform: 'rotateY(180deg)'
      })),
      state('combinado', style({
        visibility: 'false',
        transform: 'scale(0.05)',
        opacity: 0
      })),
      transition('normal => virado', [
        animate('400ms')
      ]),
      transition('virado => normal', [
        animate('400ms')
      ])
    ])
  ]
})
export class GameCardComponent implements OnInit {

  @Input() carta: Cartas;

  @Output() clicado = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
