#version 300 es

in vec3 posicao;

uniform mat4 projecao;
uniform mat4 visao;
uniform mat4 modelo;

void main() {
  gl_Position = projecao * visao * modelo * vec4(posicao, 1.0);
}
