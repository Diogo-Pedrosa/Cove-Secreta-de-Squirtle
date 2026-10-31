export function perspectiva(angulo, proporcao, perto, longe) {
  const f = 1 / Math.tan(angulo / 2);

  return new Float32Array([
    f / proporcao, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (longe + perto) / (perto - longe), -1,
    0, 0, (2 * longe * perto) / (perto - longe), 0,
  ]);
}

export function olharPara(olho, alvo, cima = [0, 1, 0]) {
  // Eixos da câmera: Z aponta para trás, X para a direita e Y para cima.
  const z = normalizar(olho.map((valor, i) => valor - alvo[i]));
  let direita = cruzar(cima, z);
  // Evita uma matriz inválida se a câmera estiver olhando bem de cima.
  if (Math.hypot(...direita) < 0.0001) {
    direita = cruzar([0, 0, -1], z);
  }
  const x = normalizar(direita);
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

function cruzar(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function identidade() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

export function multiplicar(a, b) {
  const resultado = new Float32Array(16);
  for (let coluna = 0; coluna < 4; coluna++) {
    for (let linha = 0; linha < 4; linha++) {
      for (let i = 0; i < 4; i++) {
        resultado[coluna * 4 + linha] += a[i * 4 + linha] * b[coluna * 4 + i];
      }
    }
  }
  return resultado;
}

export function transladar(x, y, z) {
  const matriz = identidade();
  matriz[12] = x;
  matriz[13] = y;
  matriz[14] = z;
  return matriz;
}

export function escalar(x, y, z) {
  const matriz = identidade();
  matriz[0] = x;
  matriz[5] = y;
  matriz[10] = z;
  return matriz;
}

export function girarX(angulo) {
  const c = Math.cos(angulo);
  const s = Math.sin(angulo);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}
