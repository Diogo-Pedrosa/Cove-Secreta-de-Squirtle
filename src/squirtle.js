import { multiplicar, transladar, escalar, girarX, girarY, girarZ } from './matrizes.js';

export function criarSquirtle(formas) {
  const azul = [.28, .75, .84];
  const barriga = [.96, .84, .54];
  const casco = [.52, .29, .14];

  function peca(forma, pai, lugar, tamanho, cor) {
    const local = multiplicar(transladar(...lugar), escalar(...tamanho));
    forma(multiplicar(pai, local), cor);
  }

  function desenhar(tempo) {
    // Prancha e personagem compartilham o mesmo balanço.

    const lugar = transladar(3 + .3 * Math.sin(tempo * .5), -.22 + .025 * Math.sin(tempo * 2), 8);
    //muda a orientação da prancha para frente e para trás, simulando o balanço do mar
    const direcao = multiplicar(lugar, girarY(.4 + .1 * Math.sin(tempo * 2)));
    const base = multiplicar(direcao, girarZ(.035 * Math.sin(tempo * 1.8)));

    peca(formas.esfera, base, [0, 0, 0], [1.5, .18, 3.4], [.96, .40, .18]);
    peca(formas.esfera, base, [0, .065, 0], [.26, .07, 3.0], [1, .91, .61]);
    peca(formas.cubo, base, [0, -.18, -.8], [.08, .35, .35], [.16, .40, .49]);

    const corpo = multiplicar(base, girarX(-.12));
    peca(formas.esfera, corpo, [0, .9, 0], [.92, 1.12, .8], azul);
    peca(formas.esfera, corpo, [0, .93, -.28], [1.1, 1.2, .52], barriga);
    peca(formas.esfera, corpo, [0, .95, -.39], [.94, 1.02, .46], casco);
    peca(formas.esfera, corpo, [0, .88, .33], [.74, .88, .22], barriga);
    // Pequenas divisões na barriga.
    for (const y of [.65, .88, 1.1]) {
      peca(formas.cubo, corpo, [0, y, .44], [.53, .018, .025], [.74, .59, .34]);
    }

    peca(formas.esfera, corpo, [0, 1.7, .16], [1.25, 1.08, 1.1], azul);
    for (const lado of [-1, 1]) {
      peca(formas.esfera, corpo, [lado * .28, 1.77, .66], [.22, .36, .10], [.17, .07, .14]);
      peca(formas.esfera, corpo, [lado * .28 - .025, 1.85, .71], [.07, .11, .035], [1, 1, 1]);
      peca(formas.esfera, corpo, [lado * .33, .26, .12], [.42, .3, .64], azul);
      const braco = multiplicar(corpo, girarZ(lado * -.22));
      peca(formas.esfera, braco, [lado * .7, 1, .05], [.7, .3, .35], azul);
    }
    peca(formas.esfera, corpo, [0, 1.48, .68], [.27, .045, .04], [.17, .07, .14]);

    // Cauda em curva, saindo por trás do casco.
    peca(formas.esfera, corpo, [.15, .55, -.66], [.36, .35, .75], azul);
    peca(formas.esfera, corpo, [.33, .68, -.95], [.52, .56, .35], azul);
    peca(formas.esfera, corpo, [.33, .73, -1.13], [.23, .25, .04], [.16, .53, .65]);
  }

  return { desenhar };
}
