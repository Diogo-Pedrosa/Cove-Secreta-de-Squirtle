export function perspectiva(angulo, proporcao, perto, longe) {
  const f = 1 / Math.tan(angulo / 2);

  return new Float32Array([
    f / proporcao, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (longe + perto) / (perto - longe), -1,
    0, 0, (2 * longe * perto) / (perto - longe), 0,
  ]);
}

export function olharPara(olho, alvo) {
  // Eixos da câmera: Z aponta para trás, X para a direita e Y para cima.
  const z = normalizar(olho.map((valor, i) => valor - alvo[i]));
  const x = normalizar([z[2], 0, -z[0]]);
  const y = [
    z[1] * x[2] - z[2] * x[1],
    z[2] * x[0] - z[0] * x[2],
    z[0] * x[1] - z[1] * x[0],
  ];

  const deslocamento = eixo => -eixo.reduce((soma, valor, i) => soma + valor * olho[i], 0);

  // WebGL recebe as matrizes organizadas por colunas.
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    deslocamento(x), deslocamento(y), deslocamento(z), 1,
  ]);
}

function normalizar(vetor) {
  const tamanho = Math.hypot(...vetor);
  return vetor.map(valor => valor / tamanho);
}
