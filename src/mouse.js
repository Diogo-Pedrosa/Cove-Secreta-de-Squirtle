export function criarMouse(tela) {
  let ponteiro = null;
  let ultimoX = 0;
  let ultimoY = 0;
  let giro = 0;
  let inclinacao = 0;
  let zoom = 0;

  tela.addEventListener('pointerdown', evento => {
    if (evento.button !== 0 || ponteiro !== null) return;
    ponteiro = evento.pointerId;
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
    tela.setPointerCapture(ponteiro);
    tela.classList.add('arrastando');
  });

  tela.addEventListener('pointermove', evento => {
    if (evento.pointerId !== ponteiro) return;
    giro += evento.clientX - ultimoX;
    inclinacao += evento.clientY - ultimoY;
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
  });

  function soltar() {
    if (ponteiro !== null && tela.hasPointerCapture(ponteiro)) {
      tela.releasePointerCapture(ponteiro);
    }
    ponteiro = null;
    tela.classList.remove('arrastando');
  }

  for (const nome of ['pointerup', 'pointercancel']) {
    tela.addEventListener(nome, evento => {
      if (evento.pointerId === ponteiro) soltar();
    });
  }
  tela.addEventListener('lostpointercapture', soltar);
  window.addEventListener('blur', () => {
    soltar();
    giro = inclinacao = zoom = 0;
  });

  tela.addEventListener('wheel', evento => {
    evento.preventDefault();
    const unidade = evento.deltaMode === 1 ? 16 : evento.deltaMode === 2 ? tela.clientHeight : 1;
    zoom += Math.max(-200, Math.min(200, evento.deltaY * unidade));
  }, { passive: false });

  function ler() {
    const movimento = { giro, inclinacao, zoom };
    giro = inclinacao = zoom = 0;
    return movimento;
  }

  return { ler };
}
