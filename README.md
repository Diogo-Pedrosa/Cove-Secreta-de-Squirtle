# Cova Secreta de Squirtle

Trabalho 2 de Computação Gráfica, feito com HTML, CSS, JavaScript e WebGL2,
sem frameworks ou bibliotecas gráficas.

Para rodar, abra um terminal na pasta do projeto:

```sh
python -m http.server 8000
```

Depois abra http://localhost:8000 no navegador. É necessário usar o servidor
para carregar os módulos JavaScript e os arquivos dos shaders.

Por enquanto, a cena tem um chão circular com cor de areia e uma câmera fixa
inclinada, usando perspectiva, e um moinho d'água no centro. A roda e as pás
giram no eixo X. Ainda não há texturas nem controles de câmera.

Arquivos:

- `index.html`: página e canvas que ocupa toda a janela.
- `style.css`: aparência da página.
- `src/main.js`: ponto de entrada, junta as partes.
- `src/webgl.js`: contexto WebGL2 e limpeza da tela.
- `src/shaders.js`: leitura, compilação e ligação dos shaders.
- `src/chao.js`: vértices e desenho do chão.
- `src/camera.js`: câmera fixa e atualização da proporção da tela.
- `src/matrizes.js`: contas de perspectiva e visão, sem biblioteca externa.
- `src/formas.js`: cubo, cilindro, aro e telhado reutilizáveis.
- `src/moinho.js`: montagem do moinho e hierarquia da roda.

O moinho combina formas simples com matrizes de posição, rotação e escala.
As peças fixas usam a matriz da base; a roda usa uma matriz deslocada até o
eixo e rotacionada com o tempo. Aros, raios e pás recebem essa mesma matriz
como pai, por isso giram juntos. Tons diferentes nas faces ajudam a enxergar
o volume; ainda não são um modelo de iluminação.
- `shaders/base.vert` e `shaders/base.frag`: shaders iniciais em GLSL ES 3.00.
