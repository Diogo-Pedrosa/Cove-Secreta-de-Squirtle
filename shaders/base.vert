#version 300 es

in vec3 posicao;

uniform mat4 projecao;
uniform mat4 visao;

void main() {
  gl_Position = projecao * visao * vec4(posicao, 1.0);
}
