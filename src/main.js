import { iniciarWebGL, ajustarTela, limparTela } from './webgl.js';
import { carregarPrograma } from './shaders.js';
import { criarCamera } from './camera.js';
import { criarChao } from './chao.js';

const tela = document.querySelector('#tela');

async function iniciar() {
  try {
    const gl = iniciarWebGL(tela);
    const programa = await carregarPrograma(gl);
    gl.useProgram(programa);
    const camera = criarCamera(gl, programa);
    const chao = criarChao(gl, programa);

    function redimensionar() {
      ajustarTela(gl);
      camera.atualizar();
      limparTela(gl);
      chao.desenhar();
    }

    window.addEventListener('resize', redimensionar);
    redimensionar();
  } catch (erro) {
    console.error(erro);
  }
}

iniciar();
