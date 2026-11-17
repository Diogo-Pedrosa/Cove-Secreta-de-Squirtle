import { alturaOnda, inclinacaoOnda } from './ondas.js';
import { obterBaseEspreguicadeira } from './cabana.js';
import { criarBone } from './bone.js';
import { multiplicar, transladar, escalar, girarX, girarY, girarZ } from './matrizes.js';

export function criarTartaruga(formas) {
  let pose = 0;
  const azul = [.28, .75, .84];
  const barriga = [.96, .84, .54];
  const casco = [.52, .29, .14];
  const bone = criarBone(formas);

  window.addEventListener('keydown', evento => {
    if (evento.key.toLowerCase() === 'p' && !evento.repeat) {
      pose = (pose + 1) % 3;
    }
  });

  function peca(forma, pai, lugar, tamanho, cor, rotacao, material) {
    let local = multiplicar(transladar(...lugar), escalar(...tamanho));
    if (rotacao) local = multiplicar(transladar(...lugar), multiplicar(rotacao, escalar(...tamanho)));
    forma(multiplicar(pai, local), cor, material);
  }

  function desenharPrancha(base) {
    peca(formas.esfera, base, [0, 0, 0], [1.5, .18, 3.4], [.96, .40, .18]);
    peca(formas.esfera, base, [0, .065, 0], [.26, .07, 3.0], [1, .91, .61]);
    peca(formas.cubo, base, [0, -.18, -.8], [.08, .35, .35], [.16, .40, .49]);
  }

  function desenharModelo(base, tempo, deitada = false) {
    const corpo = deitada ? base : multiplicar(base, girarX(-.12));
    peca(formas.esfera, corpo, [0, .9, 0], [.92, 1.12, .8], azul);
    peca(formas.esfera, corpo, [0, .93, -.28], [1.1, 1.2, .52], barriga);
    peca(formas.esfera, corpo, [0, .95, -.39], [.94, 1.02, .46], casco);
    peca(formas.esfera, corpo, [0, .88, .33], [.74, .88, .22], barriga);

    for (const y of [.65, .88, 1.1]) {
      peca(formas.cubo, corpo, [0, y, .44], [.53, .018, .025], [.74, .59, .34]);
    }

    // A sunga envolve o quadril e acompanha a pose do corpo.
    peca(formas.esfera, corpo, [0, .48, .015], [.88, .48, .85], [.87, .12, .18]);
    peca(formas.esfera, corpo, [0, .66, .025], [.90, .12, .87], [1, .91, .75]);
    peca(formas.esfera, corpo, [0, .49, .39], [.59, .40, .15], [.87, .12, .18]);
    peca(formas.cubo, corpo, [-.06, .58, .47], [.025, .15, .025], [1, .96, .87], girarZ(-.3));
    peca(formas.cubo, corpo, [.06, .58, .47], [.025, .15, .025], [1, .96, .87], girarZ(.3));

    peca(formas.esfera, corpo, [0, 1.7, .16], [1.25, 1.08, 1.1], azul);
    bone.desenhar(corpo, tempo);
    for (const lado of [-1, 1]) {
      // Armação, lente e haste acompanham a transformação da cabeça.
      peca(formas.cubo, corpo, [lado * .28, 1.79, .68], [.5, .33, .10], [.04, .045, .055]);
      peca(formas.cubo, corpo, [lado * .28, 1.79, .738], [.40, .23, .025], [.04, .14, .20]);
      peca(formas.cubo, corpo, [lado * .34, 1.86, .755], [.17, .025, .012], [.36, .65, .72], girarZ(.25));
      peca(formas.cubo, corpo, [lado * .53, 1.84, .39], [.055, .065, .62], [.04, .045, .055]);
      peca(formas.esfera, corpo, [lado * .33, .26, deitada ? -.2 : .12], [.42, .3, .64], azul);
      const braco = multiplicar(corpo, girarZ(deitada ? 0 : lado * -.22));
      peca(formas.esfera, braco, [lado * .7, 1, deitada ? -.4 : .05], [.7, .3, .35], azul);
    }
    peca(formas.cubo, corpo, [0, 1.82, .71], [.15, .065, .08], [.04, .045, .055]);
    peca(formas.esfera, corpo, [0, 1.48, .68], [.27, .045, .04], [.17, .07, .14]);
    // Nas poses de descanso a cauda fica oculta para caber sobre o apoio.
    if (!deitada) {
      peca(formas.esfera, corpo, [.15, .55, -.66], [.36, .35, .75], azul);
      peca(formas.esfera, corpo, [.33, .68, -.95], [.52, .56, .35], azul);
      peca(formas.esfera, corpo, [.33, .73, -1.13], [.23, .25, .04], [.16, .53, .65]);
    }
  }

  function basePrancha(tempo) {
    const x = 3 + .3 * Math.sin(tempo * .5);
    const y = -.22 + alturaOnda(x, tempo) + .025 * Math.sin(tempo * 2);
    return multiplicar(
      multiplicar(
        transladar(x, y, 8),
        multiplicar(girarZ(Math.atan(inclinacaoOnda(x, tempo))), girarY(.4 + .1 * Math.sin(tempo * 2)))
      ),
      girarZ(.035 * Math.sin(tempo * 1.8))
    );
  }

  function desenharNoPrancha(tempo, deitada) {
    const prancha = basePrancha(tempo);
    desenharPrancha(prancha);
    const postura = deitada
      ? multiplicar(transladar(0, .75, .95), girarX(-Math.PI / 2))
      : transladar(0, .13, 0);
    const tartaruga = multiplicar(prancha, postura);
    desenharModelo(tartaruga, tempo, deitada);
  }

  function desenharNaEspreguicadeira(tempo) {
    const cadeira = obterBaseEspreguicadeira();
    const postura = multiplicar(
      transladar(0, .70, .48),
      multiplicar(girarX(-Math.PI / 2 + .22), escalar(.6, .6, .6))
    );
    desenharModelo(multiplicar(cadeira, postura), tempo, true);
  }

  function desenhar(tempo) {
    if (pose === 0) desenharNoPrancha(tempo, false);
    else if (pose === 1) desenharNoPrancha(tempo, true);
    else desenharNaEspreguicadeira(tempo);
  }

  return {
    desenhar,
    poseAtual() {
      return pose;
    },
  };
}
