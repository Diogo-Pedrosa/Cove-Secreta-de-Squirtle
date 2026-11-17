export function criarNeblina(gl, programa) {
  const usarNeblina = gl.getUniformLocation(programa, 'usarNeblina');
  const corNeblina = gl.getUniformLocation(programa, 'corNeblina');
  let ativa = false;

  window.addEventListener('keydown', evento => {
    if (evento.code === 'KeyN' && !evento.repeat) {
      ativa = !ativa;
      evento.preventDefault();
    }
  });

  function atualizar(corCeu) {
    gl.uniform1i(usarNeblina, ativa ? 1 : 0);
    gl.uniform3fv(corNeblina, corCeu);
  }

  return { atualizar };
}
