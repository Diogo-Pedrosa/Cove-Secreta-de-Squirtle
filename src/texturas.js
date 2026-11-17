export function criarTexturaMadeira(gl) {
  const tamanho = 256;
  const pixels = new Uint8Array(tamanho * tamanho * 4);

  for (let y = 0; y < tamanho; y++) {
    for (let x = 0; x < tamanho; x++) {
      const u = x / tamanho;
      const v = y / tamanho;
      const curva = .22 * Math.sin(v * Math.PI * 2) + .08 * Math.sin(v * Math.PI * 6);
      const veio = Math.sin((u * 20 + curva) * Math.PI * 2);
      const fino = Math.sin((u * 59 + curva * 2) * Math.PI * 2);
      const junta = Math.cos(u * Math.PI * 8) > .985 ? -.28 : 0;
      const grao = .58 + .15 * veio + .07 * fino + junta;
      const valor = Math.round(Math.max(0, Math.min(1, grao)) * 255);
      const i = (y * tamanho + x) * 4;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = valor;
      pixels[i + 3] = 255;
    }
  }

  const textura = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textura);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tamanho, tamanho, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return textura;
}
