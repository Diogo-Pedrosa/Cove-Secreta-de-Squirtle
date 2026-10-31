import { identidade } from './matrizes.js';
import { criarTopo } from './terreno.js';

export function criarPraia(gl, programa) {
  const nivel = -.35;
  const pontos = [];

  for (const triangulo of criarTopo()) {
    const recorte = [];

    // Recorta cada triângulo na linha onde a areia encontra o nível do mar.
    for (let i = 0; i < 3; i++) {
      const a = triangulo[i];
      const b = triangulo[(i + 1) % 3];
      if (a[1] <= nivel) recorte.push([a[0], nivel, a[2]]);

      if ((a[1] <= nivel) !== (b[1] <= nivel)) {
        const t = (nivel - a[1]) / (b[1] - a[1]);
        recorte.push([a[0] + (b[0] - a[0]) * t, nivel, a[2] + (b[2] - a[2]) * t]);
      }
    }

    for (let i = 1; i < recorte.length - 1; i++) {
      pontos.push(...recorte[0], ...recorte[i], ...recorte[i + 1]);
    }
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pontos), gl.STATIC_DRAW);
  const posicao = gl.getAttribLocation(programa, 'posicao');
  gl.enableVertexAttribArray(posicao);
  gl.vertexAttribPointer(posicao, 3, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const modelo = gl.getUniformLocation(programa, 'modelo');
  const cor = gl.getUniformLocation(programa, 'cor');
  const matriz = identidade();

  function desenhar() {
    gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(modelo, false, matriz);
    gl.uniform4f(cor, .08, .64, .76, .82);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.drawArrays(gl.TRIANGLES, 0, pontos.length / 3);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }

  return { desenhar };
}
