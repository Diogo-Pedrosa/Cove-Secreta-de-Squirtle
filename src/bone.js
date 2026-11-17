import { multiplicar, transladar, escalar, girarY, girarZ } from './matrizes.js';

export function criarBone(formas) {
  const cores = [
    [.95, .16, .18],
    [1, .48, .08],
    [1, .85, .12],
    [.20, .73, .32],
    [.12, .45, .95],
    [.63, .24, .87],
  ];

  function peca(forma, pai, lugar, tamanho, cor) {
    const local = multiplicar(transladar(...lugar), escalar(...tamanho));
    forma(multiplicar(pai, local), cor);
  }

  function desenhar(corpo, tempo) {
    const bone = multiplicar(corpo, transladar(0, 2.08, .16));
    for (let i = 0; i < cores.length; i++) {
      const gomo = multiplicar(bone, girarY(i * Math.PI / 3));
      peca(formas.gomoBone, gomo, [0, 0, 0], [1.18, 1.18, 1.18], cores[i]);
    }
    peca(formas.esfera, bone, [0, .01, .35], [.98, .08, .72], [.12, .45, .95]);

    const haste = multiplicar(bone, girarZ(Math.PI / 2));
    peca(formas.cilindro, haste, [.42, 0, 0], [.28, .025, .025], [.95, .85, .25]);

    // Só a hélice gira. O boné recebe a posição e a inclinação da cabeça.
    const eixo = multiplicar(bone, transladar(0, .57, 0));
    const helice = multiplicar(eixo, girarY(tempo * 6));
    for (let i = 0; i < cores.length; i++) {
      const pa = multiplicar(helice, girarY(i * Math.PI / 3));
      peca(formas.cubo, pa, [.35, 0, 0], [.56, .045, .17], cores[i]);
    }
    peca(formas.esfera, helice, [0, .015, 0], [.16, .12, .16], [1, .88, .18]);
  }

  return { desenhar };
}
