import { identidade, multiplicar, transladar, escalar, girarX } from './matrizes.js';

export function criarMoinho(formas) {
  const madeira = [.55, .32, .16];
  const clara = [.72, .48, .26];
  const escura = [.30, .18, .10];

  function peca(forma, pai, lugar, tamanho, cor) {
    const local = multiplicar(transladar(...lugar), escalar(...tamanho));
    forma(multiplicar(pai, local), cor);
  }

  function desenhar(tempo) {
    const base = identidade();
    peca(formas.cubo, base, [0, .18, 0], [5.8, .36, 4.2], escura);

    // Quatro pilares apoiam a plataforma e a casinha.
    for (const x of [-1.9, .7]) {
      for (const z of [-1.4, 1.4]) {
        peca(formas.cubo, base, [x, 1.45, z], [.35, 2.2, .35], madeira);
      }
    }
    peca(formas.cubo, base, [-.6, 2.5, 0], [3.3, .3, 3.5], clara);
    peca(formas.cubo, base, [-.6, 3.35, 0], [2.9, 1.4, 2.9], madeira);
    peca(formas.telhado, base, [-.6, 4.05, 0], [3.7, 1.6, 3.7], escura);

    // Porta e janela ficam um pouco à frente da parede para não sobrepor planos.
    peca(formas.cubo, base, [-1.1, 3.15, 1.47], [.65, 1, .08], escura);
    peca(formas.cubo, base, [.25, 3.5, 1.47], [.6, .55, .08], [.35, .66, .72]);

    // O eixo fica parado; a roda gira ao redor dele.
    peca(formas.cilindro, base, [1.75, 2.65, 0], [3.3, .17, .17], escura);
    const roda = multiplicar(transladar(2.35, 2.65, 0), girarX(tempo * .6));

    for (const x of [-.48, .48]) {
      peca(formas.aro, roda, [x, 0, 0], [.18, 2.05, 2.05], madeira);
    }
    peca(formas.cilindro, roda, [0, 0, 0], [1.2, .32, .32], clara);

    for (let i = 0; i < 12; i++) {
      const fatia = multiplicar(roda, girarX(i * Math.PI * 2 / 12));
      // Cada fatia tem dois raios e uma pá ligando os lados da roda.
      for (const x of [-.48, .48]) {
        peca(formas.cubo, fatia, [x, 1, 0], [.14, 2, .15], clara);
      }
      peca(formas.cubo, fatia, [0, 2, 0], [1.25, .18, .65], clara);
    }
  }

  return { desenhar };
}
