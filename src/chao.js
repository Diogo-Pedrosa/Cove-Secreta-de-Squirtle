export function criarChao(gl, programa) {
  const raio = 12;
  const partes = 64;
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

  function desenhar() {
    gl.bindVertexArray(vao);
    gl.uniform4f(cor, 0.89, 0.80, 0.58, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
    gl.bindVertexArray(null);
  }

  return { desenhar };
}
