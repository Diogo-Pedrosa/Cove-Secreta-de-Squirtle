export function iniciarWebGL(tela) {
  const gl = tela.getContext('webgl2');

  if (!gl) {
    throw new Error('Não foi possível iniciar o WebGL2 neste navegador.');
  }

  gl.viewport(0, 0, tela.width, tela.height);
  gl.clearColor(0.45, 0.75, 0.86, 1.0);
  gl.enable(gl.DEPTH_TEST);

  return gl;
}

export function limparTela(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function ajustarTela(gl) {
  const tela = gl.canvas;
  tela.width = tela.clientWidth;
  tela.height = tela.clientHeight;
  gl.viewport(0, 0, tela.width, tela.height);
}
