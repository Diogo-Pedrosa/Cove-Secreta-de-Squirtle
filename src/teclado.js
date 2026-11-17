export function criarTeclado(aoMover) {
  const teclas = { KeyW: false, KeyA: false, KeyS: false, KeyD: false };

  window.addEventListener('keydown', evento => {
    if (!(evento.code in teclas) || evento.ctrlKey || evento.altKey || evento.metaKey) return;
    teclas[evento.code] = true;
    aoMover();
    evento.preventDefault();
  });

  window.addEventListener('keyup', evento => {
    if (evento.code in teclas) teclas[evento.code] = false;
  });

  window.addEventListener('blur', () => {
    for (const tecla in teclas) teclas[tecla] = false;
  });

  return teclas;
}
