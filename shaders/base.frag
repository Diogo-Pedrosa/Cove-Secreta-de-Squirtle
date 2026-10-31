#version 300 es
precision highp float;

out vec4 corFinal;

uniform vec4 cor;

void main() {
  corFinal = cor;
}
