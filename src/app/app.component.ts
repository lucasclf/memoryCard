import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cartas } from './game-card/shared/game-card.model';
import { ReiniciarJogoComponent } from './reiniciar-jogo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
  private contadorCartasIguais:number = 0;

  ngOnInit(): void {
    this.config();
  }

  constructor(private alerta: MatDialog) {

  }

  /**
   * Metodo responsavel por gerar os pares de cartas puxando seus
   * nomes do array @imagensCartas
   * @returns void
   */
  config(): void {
    this.cartas = [];
    this.imagensCartas.forEach((imagem) => {
      const cartaInfo: Cartas = {
        imagemId: imagem,
        estado: 'normal'
      };

      this.cartas.push({ ...cartaInfo });
      this.cartas.push({ ...cartaInfo });
    });

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
    } else if (cartaInfo.estado === 'virado') {
      cartaInfo.estado = 'normal';
      this.cartaVirada.pop();
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
    setTimeout (() => {
      const carta01 = this.cartaVirada[0];
      const carta02 = this.cartaVirada[1];
      const proxEstado = carta01.imagemId === carta02.imagemId ? 'combinado' : 'normal';
      carta01.estado = carta02.estado = proxEstado;

      this.cartaVirada = [];

      if(proxEstado === 'combinado') {
        this.contadorCartasIguais++;
        console.log(this.contadorCartasIguais)

        if(this.contadorCartasIguais === this.imagensCartas.length) {
          const alertaRef = this.alerta.open(ReiniciarJogoComponent, {
            disableClose: true
          });

          alertaRef.afterClosed().subscribe(() => {
            this.restart();
          });

        }
      }
    }, 1000);
  }

  /**
   * Método responsável por reiniciar o jogo.
   * 
   * @returns void
   */
  restart(): void {
    this.contadorCartasIguais = 0;
    this.config();
  }
}

