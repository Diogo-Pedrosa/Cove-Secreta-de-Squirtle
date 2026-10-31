import { identidade } from './matrizes.js';

export function criarChao(gl, programa) {
  const raio = 12;
  const partes = 64;
  const profundidade = raio;
  const camadas = 16;
  const faixas = [];
  const pontos = [];

  // Cada fatia liga o centro a dois pontos da borda, no plano XZ.
  for (let i = 0; i < partes; i++) {
    const angulo = (i / partes) * Math.PI * 2;
    const proximo = ((i + 1) / partes) * Math.PI * 2;

    pontos.push(
      0, 0, 0,
      Math.cos(proximo) * raio, 0, Math.sin(proximo) * raio,
      Math.cos(angulo) * raio, 0, Math.sin(angulo) * raio,
    );
  }

  const quantidadeTopo = pontos.length / 3;

  // Os anéis diminuem com o cosseno e descem com o seno.
  function ponto(altura, angulo) {
    const tamanho = raio * Math.cos(altura);
    return [tamanho * Math.cos(angulo), -profundidade * Math.sin(altura), tamanho * Math.sin(angulo)];
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
        pontos.push(...a, ...b, 0, -profundidade, 0);
      } else {
        const c = ponto(abaixo, proximo);
        const d = ponto(abaixo, angulo);
        pontos.push(...a, ...b, ...c, ...a, ...c, ...d);
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
  gl.bindVertexArray(null);

  const cor = gl.getUniformLocation(programa, 'cor');
  const modelo = gl.getUniformLocation(programa, 'modelo');
  const matriz = identidade();

  function desenhar() {
    gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(modelo, false, matriz);
    gl.uniform4f(cor, 0.89, 0.80, 0.58, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, quantidadeTopo);

    for (const faixa of faixas) {
      gl.uniform4f(cor, .53 * faixa.tom, .34 * faixa.tom, .20 * faixa.tom, 1);
      gl.drawArrays(gl.TRIANGLES, faixa.inicio, faixa.quantidade);
    }
    gl.bindVertexArray(null);
  }

  return { desenhar };
}
