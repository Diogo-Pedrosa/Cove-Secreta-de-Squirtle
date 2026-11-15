export const materiais = Object.freeze({
  padrao: [.32, .68, .18, 24],
  areia: [.38, .65, .06, 8],
  terra: [.34, .64, .04, 6],
  madeira: [.30, .68, .12, 16],
  folha: [.32, .66, .22, 28],
  plastico: [.28, .66, .42, 48],
  perola: [.32, .58, .75, 96],
  agua: [.34, .62, .85, 110],
});

export function criarIluminacao(gl, programa) {
  const localUsarIluminacao = gl.getUniformLocation(programa, 'usarIluminacao');
  const localDirecaoLuz = gl.getUniformLocation(programa, 'direcaoLuz');
  const localMaterial = gl.getUniformLocation(programa, 'material');
  let ativa = true;

  window.addEventListener('keydown', evento => {
    if (evento.key.toLowerCase() === 'l' && !evento.repeat) {
      ativa = !ativa;
    }
  });

  function atualizar() {
    gl.uniform1i(localUsarIluminacao, ativa ? 1 : 0);
    gl.uniform3f(localDirecaoLuz, -.55, -.85, -.45);
    gl.uniform4fv(localMaterial, materiais.padrao);
  }

  return {
    atualizar,
    ativa() {
      return ativa;
    },
  };
}

