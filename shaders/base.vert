#version 300 es

in vec3 posicao;
in vec3 normal;
in vec2 coordenadaTextura;
in float influenciaOndas;
in float profundidadeAgua;

uniform mat4 projecao;
uniform mat4 visao;
uniform mat4 modelo;
uniform bool usarOndas;
uniform float amplitudeOnda;
uniform float numeroOnda;
uniform float frequenciaOnda;
uniform float tempoOnda;

out vec2 uv;
out float profundidadeInterpolada;
out vec3 posicaoMundo;
out vec3 normalMundo;

void main() {
  vec3 posicaoDeformada = posicao;
  vec3 normalDeformada = normal;
  if (usarOndas) {
    float fase = numeroOnda * posicao.x + frequenciaOnda * tempoOnda;
    posicaoDeformada.y += amplitudeOnda * sin(fase) * influenciaOndas;
    float inclinacao = amplitudeOnda * numeroOnda * cos(fase) * influenciaOndas;
    normalDeformada = normalize(vec3(-inclinacao, 1.0, 0.0));
  }
  vec4 mundo = modelo * vec4(posicaoDeformada, 1.0);
  posicaoMundo = mundo.xyz;
  mat3 matrizNormal = transpose(inverse(mat3(modelo)));
  normalMundo = matrizNormal * normalDeformada;
  uv = coordenadaTextura;
  profundidadeInterpolada = profundidadeAgua;
  gl_Position = projecao * visao * mundo;
}

