import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { Cartas } from './game-card/shared/game-card.model';
import { PerdeuJogoComponent } from './perdeu-jogo';
import { ReiniciarJogoComponent } from './reiniciar-jogo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('cd', { static: false }) private countdown: CountdownComponent

  timer: number = 0
  notify = '';

  timerConfig: CountdownConfig

  /**
   * Variavel responsável por contabilizar as tentavias.
   */
  public tentativas: number = 0

  /**
 * Variavel contendo um array com os nomes das imagens das cartas.
 * 
 */
  private readonly imagensCartas = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12'
  ];

  /**
   * Variavel do tipo Cartas[] definido como um array, contendo todas
   * as cartas em jogo.
   * 
   */
  public cartas: Cartas[] = [];

  /**
   * Variavel do tipo Cartas[] definido como um array, contendo as cartas
   * viradas.
   * 
   */
  private cartaVirada: Cartas[] = [];

  /**
   * Variavel responsavel por contar o numero de cartas  que batem.
   * 
   */
  private contadorCartasIguais: number = 0;

  /**
   * Definindo dificuldades
   */
  private _showInicio: boolean;
  private _showJogo: boolean;

  inicializar(): void {
    this._showInicio = true;
    this._showJogo = false;
  }

  get showInicio(): boolean {
    return this._showInicio;
  }

  get showJogo(): boolean {
    return this._showJogo
  }

  private dificuldadeDefinida: boolean = false;

  private qtdCartas: number = 0;

  private flag: number

  /**
   * Função para iniciar o jogo, definir a dificuldade e os parametros do jogo em geral.
   * @param dificuldade Usado para definir dificuldade. Sendo o número 1 a dificuldade fácil e o número 3 a dificuldade dificil.
   */
  iniciarJogo(dificuldade: number): void {
    switch (dificuldade) {
      case 1:
        this.dificuldadeDefinida = true
        this.timer = 120
        this.qtdCartas = 6 //20
        this.flag = this.timer
        break;
      case 2:
        this.dificuldadeDefinida = true
        this.timer = 150
        this.qtdCartas = 9
        this.flag = this.timer
        break;
      case 3:
        this.dificuldadeDefinida = true
        this.timer = 140
        this.qtdCartas = 12
        this.flag = this.timer
        break;
      case 4:
        this.dificuldadeDefinida = true
        this.timer = 140
        this.qtdCartas = 1
        this.flag = this.timer
        break;
    }

    if (this.dificuldadeDefinida) {
      this.timerConfig = { leftTime: this.timer, format: 'mm:ss', demand: true, notify: [] }
      this._showInicio = false;
      this._showJogo = true;
      this.config();

    }
  }

  ngOnInit(): void {
    this.inicializar();
  }

  constructor(private alerta: MatDialog) {

  }

  /**
   * Definindo a barra de progresso e seus parametros
   */

  public progresso: number = 0;
  private equacaoProgresso: number;

  /**
   * Metodo responsavel por gerar os pares de cartas puxando seus
   * nomes do array @imagensCartas
   * @returns void
   */
  config(): void {
    this.cartas = [];
    for (let i = 0; i < this.qtdCartas; i++) {
      const cartaInfo: Cartas = {
        imagemId: this.imagensCartas[i],
        estado: 'normal'
      };
      this.cartas.push({ ...cartaInfo });
      this.cartas.push({ ...cartaInfo });
    }
    this.progresso = 0;
    this.equacaoProgresso = 100 / this.qtdCartas;
    console.log(this.equacaoProgresso)
    this.cartas = this.embaralhar(this.cartas);
  }

  /**
   * Metodo responsavel por embaralhar as cartas, utilizando o método
   * .map para vincular cada carta a um numero aleatório gerado pelo método
   * .random e depois alinhado com o método .sort.
   * 
   * @param listar é um array do tipo any
   * @returns Um array do tipo Cartas
   */
  embaralhar(listar: any[]): Cartas[] {
    return listar.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1])
  }

  /**
   * Método responsável por alterar o status das cartas entre normal 
   * e virado, armazenando elas na variavel cartaVirada.
   *  
   * @param index do tipo number
   * @returns void
   */
  cartaClicada(index: number): void {
    const cartaInfo = this.cartas[index];
    if (cartaInfo.estado === 'normal' && this.cartaVirada.length < 2) {
      cartaInfo.estado = 'virado';
      this.cartaVirada.push(cartaInfo);

      if (this.cartaVirada.length > 1) {
        this.checarCartasIguais();
      }
    }
  }

  /**
   * Método responsável por conferir se as duas cartas viradas são iguais
   * ou não, alterando o estado delas para combinado. Responsável tambem por
   * encerrar o jogo, caso o contador de cartas iguais seja igual ao de
   * cartas em jogo.
   * 
   * @returns void
   */
  checarCartasIguais(): void {
    setTimeout(() => {
      const carta01 = this.cartaVirada[0];
      const carta02 = this.cartaVirada[1];
      const proxEstado = carta01.imagemId === carta02.imagemId ? 'combinado' : 'normal';
      carta01.estado = carta02.estado = proxEstado;

      this.cartaVirada = [];

      if (proxEstado === 'combinado') {
        this.contadorCartasIguais++;
        this.progresso = this.contadorCartasIguais * this.equacaoProgresso;

        if (this.contadorCartasIguais === this.qtdCartas) {
          this.stop();
          const alertaRef = this.alerta.open(ReiniciarJogoComponent, {
            disableClose: true
          });

          alertaRef.afterClosed().subscribe(() => {
            this.restart();
          });

        }
      } this.tentativas++
    }, 1000);
  }

  /**
   * Método responsável por reiniciar o jogo.
   * 
   * @returns void
   */
  restart(): void {
    this.contadorCartasIguais = 0;
    this.tentativas = 0;
    this.inicializar();
  }

  begin(): void {
    this.countdown.begin()
  }

  stop(): void {
    this.countdown.stop();
  }

  gatilhoCronometro(e: CountdownEvent) {
    this.notify = e.action.toUpperCase();
    if (this.notify === "DONE") {
      const perdeuRef = this.alerta.open(PerdeuJogoComponent, {
        disableClose: true
      });

      perdeuRef.afterClosed().subscribe(() => {
        this.config();
        this.timerConfig = { leftTime: this.flag, format: 'mm:ss', demand: true, notify: [] }

      });
    }
  }

}

