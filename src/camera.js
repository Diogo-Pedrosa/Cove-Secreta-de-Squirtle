import { perspectiva, olharPara } from './matrizes.js';

export function criarCamera(gl, programa) {
  const localProjecao = gl.getUniformLocation(programa, 'projecao');
  const localVisao = gl.getUniformLocation(programa, 'visao');

  function atualizar() {
    const proporcao = gl.canvas.width / gl.canvas.height;
    const projecao = perspectiva(Math.PI / 3, proporcao, 0.1, 100);
    const visao = olharPara([18, 16, 24], [0, 0, 0]);

    gl.uniformMatrix4fv(localProjecao, false, projecao);
    gl.uniformMatrix4fv(localVisao, false, visao);
  }

  return { atualizar };
}
