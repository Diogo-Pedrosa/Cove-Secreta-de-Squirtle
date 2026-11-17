#version 300 es
precision highp float;

out vec4 corFinal;

uniform vec4 cor;
uniform sampler2D texturaSuperficie;
uniform bool usarTextura;
uniform bool usarMadeira;
uniform bool usarProfundidade;
uniform float profundidadeMaxima;
uniform float tempoAgua;
uniform bool usarIluminacao;
uniform vec3 direcaoLuz;
uniform vec3 corLuz;
uniform vec3 corAmbiente;
uniform vec3 posicaoCamera;
uniform vec4 material;
uniform bool usarNeblina;
uniform vec3 corNeblina;

in vec2 uv;
in float profundidadeInterpolada;
in vec3 posicaoMundo;
in vec3 normalMundo;

void main() {
  corFinal = cor;
  if (usarTextura) {
    float grao = texture(texturaSuperficie, uv).r;
    float detalhe = usarMadeira ? mix(0.48, 1.28, grao) : 0.78 + 0.44 * grao;
    corFinal.rgb *= detalhe;
  }
  if (usarProfundidade) {
    float profundidade = clamp(profundidadeInterpolada / profundidadeMaxima, 0.0, 1.0);
    vec3 rasa = vec3(0.02, 0.48, 0.72);
    vec3 media = vec3(0.015, 0.30, 0.68);
    vec3 funda = vec3(0.008, 0.12, 0.42);
    vec3 corAgua = mix(rasa, media, smoothstep(0.0, 0.58, profundidade));
    corAgua = mix(corAgua, funda, smoothstep(0.42, 1.0, profundidade));

    float ondulacao = sin(uv.x * 17.0 + sin(uv.y * 12.0 + tempoAgua) * 1.4)
      * cos(uv.y * 15.0 - tempoAgua * 0.7);
    float reflexo = smoothstep(0.78, 0.98, ondulacao) * 0.055 * (1.0 - profundidade);
    corFinal.rgb = mix(corAgua, vec3(0.68, 0.86, 0.96), reflexo);
    corFinal.a = mix(0.48, 0.72, smoothstep(0.0, 1.0, profundidade));
  }
  if (usarIluminacao && length(normalMundo) > 0.0001) {
    vec3 n = normalize(normalMundo);
    vec3 l = normalize(-direcaoLuz);
    vec3 v = normalize(posicaoCamera - posicaoMundo);
    vec3 r = reflect(-l, n);

    float ambiente = material.x;
    float difusa = material.y * max(dot(n, l), 0.0);
    float especular = 0.0;
    if (dot(n, l) > 0.0 && material.z > 0.0) {
      especular = material.z * pow(max(dot(r, v), 0.0), max(material.w, 1.0));
    }

    corFinal.rgb = corFinal.rgb * (ambiente * corAmbiente + difusa * corLuz) + especular * corLuz;
  }
  if (usarNeblina) {
    float distancia = length(posicaoCamera - posicaoMundo);
    float fator = smoothstep(10.0, 60.0, distancia) * 0.8;
    corFinal.rgb = mix(corFinal.rgb, corNeblina, fator);
  }
}

