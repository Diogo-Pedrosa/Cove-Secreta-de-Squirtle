import { perspectiva, olharPara } from './matrizes.js';
import { criarMouse } from './mouse.js';

export function criarCamera(gl, programa) {
  const localProjecao = gl.getUniformLocation(programa, 'projecao');
  const localVisao = gl.getUniformLocation(programa, 'visao');
  const atual = { posicao: [18, 16, 24], alvo: [0, 1, 0], cima: [0, 1, 0] };
  const mouse = criarMouse(gl.canvas);

  function mover() {
    const movimento = mouse.ler();
    if (!movimento.giro && !movimento.inclinacao && !movimento.zoom) return;

    const [x, y, z] = atual.posicao.map((valor, i) => valor - atual.alvo[i]);
    // Mouse usa o deslocamento em pixels, sem multiplicar por deltaTime.
    const angulo = Math.atan2(x, z) - movimento.giro * .005;
    const distancia = Math.max(8, Math.min(55, Math.hypot(x, y, z) + movimento.zoom * .02));
    const inclinacao = Math.max(.12, Math.min(Math.PI / 2 - .02,
      Math.atan2(y, Math.hypot(x, z)) + movimento.inclinacao * .005));
    const raio = distancia * Math.cos(inclinacao);

    atual.posicao = [
      atual.alvo[0] + Math.sin(angulo) * raio,
      atual.alvo[1] + Math.sin(inclinacao) * distancia,
      atual.alvo[2] + Math.cos(angulo) * raio,
    ];
    atual.cima = [0, 1, 0];
  }

  function atualizar() {
    mover();

    const proporcao = gl.canvas.width / gl.canvas.height;
    const projecao = perspectiva(Math.PI / 3, proporcao, 0.1, 100);
    const visao = olharPara(atual.posicao, atual.alvo, atual.cima);

    gl.uniformMatrix4fv(localProjecao, false, projecao);
    gl.uniformMatrix4fv(localVisao, false, visao);
  }

  return { atualizar };
}
