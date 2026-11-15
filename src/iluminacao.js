import { alturaAreia } from './terreno.js';

export const materiais = Object.freeze({
  padrao: [.32, .68, .18, 24],
  areia: [.38, .65, .06, 8],
  terra: [.34, .64, .04, 6],
  madeira: [.30, .68, .12, 16],
  folha: [.32, .66, .22, 28],
  plastico: [.28, .66, .42, 48],
  perola: [.32, .58, .75, 96],
  agua: [.34, .62, .85, 110],
  emissivo: [1.0, 0.0, 0.0, 1],
});

function misturar(a, b, t) {
  const f = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

function suavizar(minimo, maximo, valor) {
  const x = Math.max(0, Math.min(1, (valor - minimo) / (maximo - minimo)));
  return x * x * (3 - 2 * x);
}

function alturaTerrenoNoDomo(x, z, alturaAreia) {
  const r = Math.hypot(x, z);
  const raio = 12;
  if (r <= raio) return alturaAreia(x, z);
  return 0;
}

export function criarIluminacao(gl, programa) {
  const localUsarIluminacao = gl.getUniformLocation(programa, 'usarIluminacao');
  const localDirecaoLuz = gl.getUniformLocation(programa, 'direcaoLuz');
  const localCorLuz = gl.getUniformLocation(programa, 'corLuz');
  const localCorAmbiente = gl.getUniformLocation(programa, 'corAmbiente');
  const localMaterial = gl.getUniformLocation(programa, 'material');
  let ativa = true;

  // Estrelas espalhadas na metade superior do domo.
  const estrelas = [];
  let semente = 0x93c46;
  function aleatorio() {
    semente = (1664525 * semente + 1013904223) >>> 0;
    return semente / 0x100000000;
  }
  for (let i = 0; i < 42; i++) {
    const theta = aleatorio() * Math.PI * 2;
    const phi = .18 + aleatorio() * (Math.PI / 2 - .24);
    const raio = 11.4;
    estrelas.push({
      x: raio * Math.cos(phi) * Math.cos(theta),
      y: raio * Math.sin(phi),
      z: raio * Math.cos(phi) * Math.sin(theta),
      tamanho: .09 + aleatorio() * .07,
      fase: aleatorio() * Math.PI * 2,
    });
  }

  window.addEventListener('keydown', evento => {
    if (evento.key.toLowerCase() === 'l' && !evento.repeat) {
      ativa = !ativa;
    }
  });

  function calcularCiclo(tempo) {
    // Ciclo completo de 48 segundos.
    const angulo = tempo * (Math.PI * 2 / 48) + .65;
    const raioOrbita = 10.6;
    const inclinacaoZ = -3.4;

    const sol = [
      Math.cos(angulo) * raioOrbita,
      Math.sin(angulo) * raioOrbita,
      Math.sin(angulo) * inclinacaoZ,
    ];
    const lua = [-sol[0], -sol[1], -sol[2]];

    const alturaSol = Math.sin(angulo);
    const fatorDia = suavizar(-.18, .28, alturaSol);
    const fatorCrepusculo = Math.max(0, 1 - Math.abs(alturaSol) / .34);

    // Quando o sol está acima do horizonte ele ilumina; à noite a lua assume.
    const astroAtivo = alturaSol >= -.05 ? sol : lua;
    const comprimento = Math.hypot(...astroAtivo) || 1;
    const direcaoLuz = [
      -astroAtivo[0] / comprimento,
      -astroAtivo[1] / comprimento,
      -astroAtivo[2] / comprimento,
    ];

    const luzNoite = [.26, .35, .62];
    const luzDia = [1.0, .97, .88];
    const luzPorDoSol = [1.0, .58, .30];
    let corLuz = misturar(luzNoite, luzDia, fatorDia);
    corLuz = misturar(corLuz, luzPorDoSol, fatorCrepusculo * .7);

    const ambNoite = [.32, .38, .64];
    const ambDia = [1.0, .98, .94];
    const ambPorDoSol = [.95, .65, .52];
    let corAmbiente = misturar(ambNoite, ambDia, fatorDia);
    corAmbiente = misturar(corAmbiente, ambPorDoSol, fatorCrepusculo * .45);

    const ceuNoite = [.05, .08, .18];
    const ceuDia = [.45, .75, .86];
    const ceuPorDoSol = [.86, .48, .36];
    let corCeu = misturar(ceuNoite, ceuDia, fatorDia);
    corCeu = misturar(corCeu, ceuPorDoSol, fatorCrepusculo * .65);

    return { sol, lua, alturaSol, fatorDia, fatorCrepusculo, direcaoLuz, corLuz, corAmbiente, corCeu };
  }

  let estadoAtual = calcularCiclo(0);

  function atualizar(tempo = 0) {
    estadoAtual = calcularCiclo(tempo);
    gl.clearColor(estadoAtual.corCeu[0], estadoAtual.corCeu[1], estadoAtual.corCeu[2], 1.0);
    gl.uniform1i(localUsarIluminacao, ativa ? 1 : 0);
    gl.uniform3fv(localDirecaoLuz, estadoAtual.direcaoLuz);
    gl.uniform3fv(localCorLuz, estadoAtual.corLuz);
    gl.uniform3fv(localCorAmbiente, estadoAtual.corAmbiente);
    gl.uniform4fv(localMaterial, materiais.padrao);
  }

  function desenharCeu(tempo = 0, formas, transladar, escalar, multiplicar) {
    if (!formas) return;
    const { sol, lua, fatorDia, fatorCrepusculo } = estadoAtual;
    const iluminacaoAnterior = ativa;

    // Desenha os astros com brilho próprio (emissivos, sem escurecer pela normal).
    gl.uniform1i(localUsarIluminacao, 0);

    const chaoSol = alturaTerrenoNoDomo(sol[0], sol[2], alturaAreia);
    const visSol = suavizar(chaoSol - .1, chaoSol + .9, sol[1]);
    if (visSol > .02) {
      const corSol = misturar([1.0, .92, .38], [1.0, .48, .18], fatorCrepusculo * .85);
      const escalaSol = 1.35 * visSol;
      const matrizSol = multiplicar(transladar(...sol), escalar(escalaSol, escalaSol, escalaSol));
      formas.esfera(matrizSol, corSol, materiais.emissivo);
    }

    const chaoLua = alturaTerrenoNoDomo(lua[0], lua[2], alturaAreia);
    const visLua = suavizar(chaoLua - .1, chaoLua + .7, lua[1]);
    if (visLua > .02) {
      const escalaLua = .95 * visLua;
      const matrizLua = multiplicar(transladar(...lua), escalar(escalaLua, escalaLua, escalaLua));
      formas.esfera(matrizLua, [.92, .95, 1.0], materiais.emissivo);
    }

    const visibilidadeEstrelas = 1 - fatorDia;
    if (visibilidadeEstrelas > .08) {
      for (const estrela of estrelas) {
        const cintilacao = .75 + .25 * Math.sin(tempo * 3.2 + estrela.fase);
        const s = estrela.tamanho * visibilidadeEstrelas * cintilacao;
        const matrizEstrela = multiplicar(transladar(estrela.x, estrela.y, estrela.z), escalar(s, s, s));
        formas.esfera(matrizEstrela, [.95, .97, 1.0], materiais.emissivo);
      }
    }

    gl.uniform1i(localUsarIluminacao, iluminacaoAnterior ? 1 : 0);
  }

  return {
    atualizar,
    desenharCeu,
    ativa() {
      return ativa;
    },
  };
}
