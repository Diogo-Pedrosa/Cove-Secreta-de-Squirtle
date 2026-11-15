import { materiais } from './iluminacao.js';

function normalTriangulo(a, b, c) {
  const ux = b[0] - a[0];
  const uy = b[1] - a[1];
  const uz = b[2] - a[2];
  const vx = c[0] - a[0];
  const vy = c[1] - a[1];
  const vz = c[2] - a[2];
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const tamanho = Math.hypot(nx, ny, nz) || 1;
  return [nx / tamanho, ny / tamanho, nz / tamanho];
}

export function interpretarObj(conteudo) {
  const vertices = [];
  const triangulos = [];
  const normais = [];
  const linhas = conteudo.split(/\r?\n/);

  for (let numeroLinha = 0; numeroLinha < linhas.length; numeroLinha++) {
    const partes = linhas[numeroLinha].replace(/#.*/, '').trim().split(/\s+/);
    if (!partes[0] || partes[0] !== 'v' && partes[0] !== 'f') continue;

    if (partes[0] === 'v') {
      const vertice = partes.slice(1, 4).map(Number);
      if (vertice.length !== 3 || !vertice.every(Number.isFinite)) {
        throw new Error(`Vértice inválido na linha ${numeroLinha + 1} do OBJ.`);
      }
      vertices.push(vertice);
      continue;
    }

    const indices = partes.slice(1).map(token => {
      const indiceObj = Number(token.split('/')[0]);
      if (!Number.isInteger(indiceObj) || indiceObj === 0) {
        throw new Error(`Índice de face inválido na linha ${numeroLinha + 1} do OBJ.`);
      }
      const indice = indiceObj > 0 ? indiceObj - 1 : vertices.length + indiceObj;
      if (indice < 0 || indice >= vertices.length) {
        throw new Error(`Índice de vértice fora do intervalo na linha ${numeroLinha + 1} do OBJ.`);
      }
      return indice;
    });

    if (indices.length < 3) {
      throw new Error(`Face com menos de três vértices na linha ${numeroLinha + 1} do OBJ.`);
    }

    for (let i = 1; i < indices.length - 1; i++) {
      const a = vertices[indices[0]];
      const b = vertices[indices[i]];
      const c = vertices[indices[i + 1]];
      let n = normalTriangulo(a, b, c);
      const mx = (a[0] + b[0] + c[0]) / 3;
      const my = (a[1] + b[1] + c[1]) / 3 - .12;
      const mz = (a[2] + b[2] + c[2]) / 3;
      if (n[0] * mx + n[1] * my + n[2] * mz < 0) {
        n = [-n[0], -n[1], -n[2]];
      }
      triangulos.push(...a, ...b, ...c);
      normais.push(...n, ...n, ...n);
    }
  }

  if (triangulos.length === 0) {
    throw new Error('O arquivo OBJ não contém faces válidas.');
  }

  return {
    vertices: new Float32Array(triangulos),
    normais: new Float32Array(normais),
  };
}

export async function carregarObj(gl, programa, caminho) {
  const resposta = await fetch(caminho);
  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar o modelo OBJ: ${caminho}`);
  }

  const { vertices, normais } = interpretarObj(await resposta.text());
  const quantidade = vertices.length / 3;
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const bufferVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const posicao = gl.getAttribLocation(programa, 'posicao');
  gl.enableVertexAttribArray(posicao);
  gl.vertexAttribPointer(posicao, 3, gl.FLOAT, false, 0, 0);

  const normal = gl.getAttribLocation(programa, 'normal');
  if (normal !== -1) {
    const bufferNormais = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormais);
    gl.bufferData(gl.ARRAY_BUFFER, normais, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normal);
    gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);
  }

  const coordenadaTextura = gl.getAttribLocation(programa, 'coordenadaTextura');
  const bufferTextura = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferTextura);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quantidade * 2), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(coordenadaTextura);
  gl.vertexAttribPointer(coordenadaTextura, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const localModelo = gl.getUniformLocation(programa, 'modelo');
  const cor = gl.getUniformLocation(programa, 'cor');
  const usarTextura = gl.getUniformLocation(programa, 'usarTextura');
  const usarOndas = gl.getUniformLocation(programa, 'usarOndas');
  const usarProfundidade = gl.getUniformLocation(programa, 'usarProfundidade');
  const localMaterial = gl.getUniformLocation(programa, 'material');

  function desenhar(matriz, tinta, material = materiais.plastico) {
    gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(localModelo, false, matriz);
    gl.uniform4f(cor, tinta[0], tinta[1], tinta[2], 1);
    gl.uniform4fv(localMaterial, material);
    gl.uniform1i(usarTextura, 0);
    gl.uniform1i(usarOndas, 0);
    gl.uniform1i(usarProfundidade, 0);
    gl.drawArrays(gl.TRIANGLES, 0, quantidade);
    gl.bindVertexArray(null);
  }

  return { desenhar };
}
