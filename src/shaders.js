async function lerShader(caminho) {
  const resposta = await fetch(caminho);

  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar o shader: ${caminho}`);
  }

  return resposta.text();
}

function criarShader(gl, tipo, codigo) {
  const shader = gl.createShader(tipo);
  gl.shaderSource(shader, codigo);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const erro = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Erro ao compilar shader: ${erro}`);
  }

  return shader;
}

export async function carregarPrograma(gl) {
  const vert = await lerShader(new URL('../shaders/base.vert', import.meta.url));
  const frag = await lerShader(new URL('../shaders/base.frag', import.meta.url));
  const vertex = criarShader(gl, gl.VERTEX_SHADER, vert);
  const fragment = criarShader(gl, gl.FRAGMENT_SHADER, frag);
  const programa = gl.createProgram();

  gl.attachShader(programa, vertex);
  gl.attachShader(programa, fragment);
  gl.linkProgram(programa);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
    const erro = gl.getProgramInfoLog(programa);
    gl.deleteProgram(programa);
    throw new Error(`Erro ao ligar os shaders: ${erro}`);
  }

  return programa;
}
