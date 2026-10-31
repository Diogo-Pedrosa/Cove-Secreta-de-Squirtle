import { identidade } from './matrizes.js';
import { alturaAreia, criarTopo, raioIlha, partesIlha } from './terreno.js';

export function criarChao(gl, programa) {
  const raio = raioIlha;
  const partes = partesIlha;
  const profundidade = raio;
  const camadas = 16;
  const faixas = [];
  const pontos = [];

  const areia = [];
  const molhada = [];
  for (const triangulo of criarTopo()) {
    const altura = triangulo.reduce((soma, ponto) => soma + ponto[1], 0) / 3;
    const destino = altura < -.08 ? molhada : areia;
    for (const ponto of triangulo) destino.push(...ponto);
  }
  pontos.push(...areia, ...molhada);
  const quantidadeAreia = areia.length / 3;
  const quantidadeTopo = pontos.length / 3;

  // Os anéis diminuem com o cosseno e descem com o seno.
  function ponto(altura, angulo) {
    const tamanho = raio * Math.cos(altura);
    const borda = alturaAreia(raio * Math.cos(angulo), raio * Math.sin(angulo));
    const y = -profundidade * Math.sin(altura) + borda * Math.cos(altura) ** 2;
    return [tamanho * Math.cos(angulo), y, tamanho * Math.sin(angulo)];
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
    gl.drawArrays(gl.TRIANGLES, 0, quantidadeAreia);
    gl.uniform4f(cor, .73, .65, .44, 1);
    gl.drawArrays(gl.TRIANGLES, quantidadeAreia, quantidadeTopo - quantidadeAreia);

    for (const faixa of faixas) {
      gl.uniform4f(cor, .53 * faixa.tom, .34 * faixa.tom, .20 * faixa.tom, 1);
      gl.drawArrays(gl.TRIANGLES, faixa.inicio, faixa.quantidade);
    }
    gl.bindVertexArray(null);
  }

  return { desenhar };
}
