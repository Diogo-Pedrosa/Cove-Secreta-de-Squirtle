import { identidade } from './matrizes.js';
import { alturaAreia, criarTopo, raioIlha, partesIlha } from './terreno.js';
import { materiais } from './iluminacao.js';

function normalTriangulo(a, b, c) {
  const ux = b[0] - a[0];
  const uy = b[1] - a[1];
  const uz = b[2] - a[2];
  const vx = c[0] - a[0];
  const vy = c[1] - a[1];
  const vz = c[2] - a[2];
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const tamanho = Math.hypot(nx, ny, nz) || 1;
  return [nx / tamanho, ny / tamanho, nz / tamanho];
}

export function criarChao(gl, programa) {
  const raio = raioIlha;
  const partes = partesIlha;
  const profundidade = raio;
  const camadas = 16;
  const faixas = [];
  const pontos = [];
  const normais = [];

  function adicionarTriangulo( destino, a, b, c) {
    let n = normalTriangulo(a, b, c);
    if (destino !== pontos && n[1] < 0) {
      n = [-n[0], -n[1], -n[2]];
    }
    destino.push(...a, ...b, ...c);
    return n;
  }

  const areia = [];
  const normaisAreia = [];
  const molhada = [];
  const normaisMolhada = [];
  for (const triangulo of criarTopo()) {
    const altura = triangulo.reduce((soma, ponto) => soma + ponto[1], 0) / 3;
    const ehMolhada = altura < -.08;
    const destino = ehMolhada ? molhada : areia;
    const destinoNormal = ehMolhada ? normaisMolhada : normaisAreia;
    const n = adicionarTriangulo(destino, triangulo[0], triangulo[1], triangulo[2]);
    destinoNormal.push(...n, ...n, ...n);
  }
  pontos.push(...areia, ...molhada);
  normais.push(...normaisAreia, ...normaisMolhada);
  const quantidadeAreia = areia.length / 3;
  const quantidadeTopo = pontos.length / 3;

  // Os anéis diminuem com o cosseno e descem com o seno.
  function ponto(altura, angulo) {
    const tamanho = raio * Math.cos(altura);
    const borda = alturaAreia(raio * Math.cos(angulo), raio * Math.sin(angulo));
    const y = -profundidade * Math.sin(altura) + borda * Math.cos(altura) ** 2;
    return [tamanho * Math.cos(angulo), y, tamanho * Math.sin(angulo)];
  }

  function adicionarHemisferio(a, b, c) {
    let n = normalTriangulo(a, b, c);
    const mx = (a[0] + b[0] + c[0]) / 3;
    const my = (a[1] + b[1] + c[1]) / 3;
    const mz = (a[2] + b[2] + c[2]) / 3;
    if (n[0] * mx + n[1] * my + n[2] * mz < 0) {
      n = [-n[0], -n[1], -n[2]];
    }
    pontos.push(...a, ...b, ...c);
    normais.push(...n, ...n, ...n);
  }

  for (let camada = 0; camada < camadas; camada++) {
    const inicio = pontos.length / 3;
    const altura = (camada / camadas) * Math.PI / 2;
    const abaixo = ((camada + 1) / camadas) * Math.PI / 2;

    for (let i = 0; i < partes; i++) {
      const angulo = (i / partes) * Math.PI * 2;
      const proximo = ((i + 1) / partes) * Math.PI * 2;
      const a = ponto(altura, angulo);
      const b = ponto(altura, proximo);

      if (camada === camadas - 1) {
        // Todos os trechos terminam no mesmo ponto, fechando a meia esfera.
        adicionarHemisferio(a, b, [0, -profundidade, 0]);
      } else {
        const c = ponto(abaixo, proximo);
        const d = ponto(abaixo, angulo);
        adicionarHemisferio(a, b, c);
        adicionarHemisferio(a, c, d);
      }
    }
    faixas.push({ inicio, quantidade: pontos.length / 3 - inicio, tom: 1 - camada / camadas * .35 });
  }

  const vertices = new Float32Array(pontos);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const posicao = gl.getAttribLocation(programa, 'posicao');
  gl.enableVertexAttribArray(posicao);
  gl.vertexAttribPointer(posicao, 3, gl.FLOAT, false, 0, 0);

  const normal = gl.getAttribLocation(programa, 'normal');
  if (normal !== -1) {
    const bufferNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormal);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normais), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normal);
    gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);
  }

  const coordenadaTextura = gl.getAttribLocation(programa, 'coordenadaTextura');
  const coordenadas = [];
  for (let i = 0; i < pontos.length; i += 3) {
    coordenadas.push(pontos[i] * .16, pontos[i + 2] * .16);
  }
  const bufferTextura = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferTextura);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordenadas), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(coordenadaTextura);
  gl.vertexAttribPointer(coordenadaTextura, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const cor = gl.getUniformLocation(programa, 'cor');
  const modelo = gl.getUniformLocation(programa, 'modelo');
  const usarTextura = gl.getUniformLocation(programa, 'usarTextura');
  const localMaterial = gl.getUniformLocation(programa, 'material');
  const textura = criarTexturaAreia(gl);
  const matriz = identidade();

  function desenhar() {
    gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(modelo, false, matriz);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textura);
    gl.uniform1i(usarTextura, 1);
    gl.uniform4fv(localMaterial, materiais.areia);
    gl.uniform4f(cor, 0.89, 0.80, 0.58, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, quantidadeAreia);
    gl.uniform4f(cor, .73, .65, .44, 1);
    gl.drawArrays(gl.TRIANGLES, quantidadeAreia, quantidadeTopo - quantidadeAreia);
    gl.uniform1i(usarTextura, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.uniform4fv(localMaterial, materiais.terra);
    for (const faixa of faixas) {
      gl.uniform4f(cor, .53 * faixa.tom, .34 * faixa.tom, .20 * faixa.tom, 1);
      gl.drawArrays(gl.TRIANGLES, faixa.inicio, faixa.quantidade);
    }
    gl.bindVertexArray(null);
  }

  return { desenhar };
}

function criarTexturaAreia(gl) {
  const tamanho = 128;
  const pixels = new Uint8Array(tamanho * tamanho * 4);
  const tamanhoCelula = 4;
  const celulas = new Uint8Array(tamanho / tamanhoCelula * (tamanho / tamanhoCelula));
  let semente = 0x51a7d;

  function aleatorio() {
    semente = (1664525 * semente + 1013904223) >>> 0;
    return semente / 0x100000000;
  }

  for (let i = 0; i < celulas.length; i++) {
    celulas[i] = 128 + (aleatorio() - .5) * 96;
  }

  for (let y = 0; y < tamanho; y++) {
    for (let x = 0; x < tamanho; x++) {
      const celula = celulas[Math.floor(y / tamanhoCelula) * (tamanho / tamanhoCelula) + Math.floor(x / tamanhoCelula)];
      let grao = 128 + (celula - 128) * .55 + (aleatorio() - .5) * 48;
      if (aleatorio() < .035) grao += (aleatorio() - .5) * 100;
      const valor = Math.max(0, Math.min(255, Math.round(grao)));
      const i = (y * tamanho + x) * 4;
      pixels[i] = valor;
      pixels[i + 1] = valor;
      pixels[i + 2] = valor;
      pixels[i + 3] = 255;
    }
  }

  const textura = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textura);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tamanho, tamanho, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return textura;
}
