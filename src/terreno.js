export const raioIlha = 12;
export const partesIlha = 64;

export function alturaAreia(x, z) {
  // A praia fica no lado positivo de Z, com uma curva suave na costa.
  const costa = 2.4 + .7 * Math.cos(x * .45) + .025 * x * x;
  const t = Math.max(0, Math.min(1, (z - costa) / 3));
  return -.9 * t * t * (3 - 2 * t);
}

export function criarTopo() {
  const triangulos = [];
  const aneis = 24;

  function ponto(anel, parte) {
    const raio = raioIlha * anel / aneis;
    const angulo = parte * Math.PI * 2 / partesIlha;
    const x = Math.cos(angulo) * raio;
    const z = Math.sin(angulo) * raio;
    return [x, alturaAreia(x, z), z];
  }

  for (let anel = 0; anel < aneis; anel++) {
    for (let i = 0; i < partesIlha; i++) {
      const a = ponto(anel, i);
      const b = ponto(anel, i + 1);
      const c = ponto(anel + 1, i + 1);
      const d = ponto(anel + 1, i);
      triangulos.push([a, c, d]);
      if (anel > 0) triangulos.push([a, b, c]);
    }
  }

  return triangulos;
}
