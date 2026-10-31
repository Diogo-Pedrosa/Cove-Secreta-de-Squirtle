# Cova Secreta de Squirtle

Trabalho 2 de Computação Gráfica, feito com HTML, CSS, JavaScript e WebGL2,
sem frameworks ou bibliotecas gráficas.

Para rodar, abra um terminal na pasta do projeto:

```sh
python -m http.server 8000
```

Depois abra http://localhost:8000 no navegador. É necessário usar o servidor
para carregar os módulos JavaScript e os arquivos dos shaders.

Por enquanto, a cena tem um chão circular com cor de areia, uma câmera aérea
com perspectiva e um moinho d'água no centro. A roda e as pás giram no eixo X.
Ainda não há texturas.

A ilha tem areia no topo plano e uma meia esfera de terra embaixo, formada
por 16 anéis que diminuem até fechar no fundo. O raio e a profundidade são
12; a variável `profundidade` em `chao.js` permite achatar essa base.
O topo continua na altura zero, sem mudar a posição do moinho.

Controles da câmera:

- Arrastar com o botão esquerdo: girar ao redor do moinho e mudar a inclinação.
- Rodinha do mouse: aproximar e afastar.

O mouse usa o deslocamento em pixels. A distância fica entre 8 e 55 e a inclinação não passa por baixo
do chão nem vira a câmera de cabeça para baixo.

Arquivos:

- `index.html`: página e canvas que ocupa toda a janela.
- `style.css`: aparência da página.
- `src/main.js`: ponto de entrada, junta as partes.
- `src/webgl.js`: contexto WebGL2 e limpeza da tela.
- `src/shaders.js`: leitura, compilação e ligação dos shaders.
- `src/chao.js`: vértices e desenho do chão.
- `src/camera.js`: câmera orbital e limites de distância e inclinação.
- `src/mouse.js`: arraste, captura do ponteiro e rodinha do mouse.
- `src/matrizes.js`: contas de perspectiva e visão, sem biblioteca externa.
- `src/formas.js`: cubo, cilindro, aro e telhado reutilizáveis.
- `src/moinho.js`: montagem do moinho e hierarquia da roda.
- `shaders/base.vert` e `shaders/base.frag`: shaders iniciais em GLSL ES 3.00.

O moinho combina formas simples com matrizes de posição, rotação e escala.
As peças fixas usam a matriz da base; a roda usa uma matriz deslocada até o
eixo e rotacionada com o tempo. Aros, raios e pás recebem essa mesma matriz
como pai, por isso giram juntos. Tons diferentes nas faces ajudam a enxergar
o volume; ainda não são um modelo de iluminação.

Referência para a câmera: [Sistema Solar, de fegemo](https://github.com/fegemo/ufci-cg-solar-system/blob/main/main.vanilla.js).
Foi usada a ideia de definir a câmera por posição, alvo e vetor para cima
para calcular a matriz de visão. As contas continuam nos módulos do projeto,
sem usar TWGL.
O controle orbital com mouse foi acrescentado nesta implementação; a versão
consultada do exemplo usa vistas predefinidas, tecla C e uma lista de seleção.
