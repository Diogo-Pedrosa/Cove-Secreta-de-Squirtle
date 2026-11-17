# 🐢 Cova Secreta de Squirtle — Diorama em WebGL2

Trabalho Prático 2 de Computação Gráfica. Uma pequena ilha tropical em formato de diorama, com praia, um moinho d’água e um Squirtle aproveitando o mar.

📦 [Repositório do projeto](https://github.com/Diogo-Pedrosa/Cove-Secreta-de-Squirtle)

🎬 Vídeo demonstrativo — a adicionar.

## (a) A cena

A ilha tem uma superfície de areia sobre uma base de terra em formato de meia esfera. Em um dos lados, o terreno desce até o mar, onde o Squirtle surfa e descansa sobre uma prancha. No centro fica um moinho d’água com roda, raios e pás que giram juntos. Palmeiras, conchas, uma estrela-do-mar e uma cabana com espreguiçadeira completam o cenário.

O Squirtle usa óculos escuros, sunga vermelha e um boné colorido com hélice giratória. A tecla P alterna entre três poses — surfando, deitado na prancha e descansando na espreguiçadeira. O personagem e a prancha acompanham a ondulação da água.

O ciclo de dia e noite dura aproximadamente 48 segundos. O Sol e a Lua percorrem o céu, a iluminação e a cor de fundo mudam ao longo do tempo e as estrelas aparecem à noite. A câmera permite observar o diorama por todos os lados.

### Controles

| Tecla ou ação | Função |
| --- | --- |
| `1` | Câmera automática, inclinada a aproximadamente 45°, girando ao redor da ilha |
| `2` | Câmera orbital manual |
| `W` / `S` | Aproximar e afastar a câmera |
| `A` / `D` | Girar a câmera ao redor da ilha |
| Arrastar com o botão esquerdo | Girar e mudar a inclinação na câmera manual |
| Rodinha do mouse | Aproximar e afastar em ambos os modos |
| `P` | Alternar entre as três poses do Squirtle |
| `L` | Ligar ou desligar a iluminação de Phong |
| `F` | Alternar o terreno entre preenchido e malha de arames |
| `N` | Ligar ou desligar a neblina |

Usar WASD ativa a câmera manual. A distância da câmera fica entre 8 e 55 unidades, e a inclinação tem limites para manter a visão acima do terreno. A cena começa com a câmera automática, iluminação ligada e neblina desligada.

### Como executar localmente

É necessário ter Python 3 e um navegador com suporte a WebGL2, como Chrome, Edge ou Firefox.

1. Baixe e extraia o projeto, ou clone o repositório.
2. Abra um terminal na pasta que contém `index.html`.
3. Inicie o servidor local.

```sh
python -m http.server 8000
```

4. Abra [http://localhost:8000](http://localhost:8000) no navegador.

No Windows, também é possível iniciar o servidor com `py -m http.server 8000`. Mantenha o terminal aberto durante a execução. Para encerrar o servidor, pressione `Ctrl + C` no terminal. Após editar os arquivos, atualize o navegador com `Ctrl + F5`.

O projeto usa módulos JavaScript e carrega shaders e o modelo OBJ por `fetch`, por isso deve ser aberto pelo servidor HTTP. A execução é feita diretamente no navegador, com HTML, CSS, JavaScript, WebGL2 e GLSL ES 3.00.

## (b) Criadores

- [Diogo-Pedrosa](https://github.com/Diogo-Pedrosa)
- [PauloHSilva1](https://github.com/PauloHSilva1)

## (c) Screenshots

As capturas serão adicionadas antes da entrega.

| Captura | O que mostrar | Estado |
| --- | --- | --- |
| Vista geral durante o dia | Ilha, moinho, palmeiras, cabana e praia | Pendente |
| Vista noturna | Lua, estrelas e mudança da iluminação | Pendente |
| Detalhes e interações | Squirtle com acessórios, ondas e uma das poses de descanso | Pendente |

## (d) Recursos e opcionais implementados

### 1. Modelagem hierárquica e animação

O moinho possui uma estrutura fixa e uma roda filha. Aros, raios e pás compartilham a transformação da roda, que gira em torno do eixo X. O boné do Squirtle também possui uma hélice animada, ligada à transformação do personagem nas três poses.

O moinho d’água foi escolhido como objeto central para a temática da praia, conforme a possibilidade de usar outro tema com um objeto hierárquico animado.

### 2. Vários tipos de objetos

A cena reúne moinho, palmeiras, conchas, estrela-do-mar, cabana, espreguiçadeira, prancha e Squirtle. As palmeiras reutilizam a mesma geometria com posições, tamanhos e rotações diferentes.

### 3. Terreno subdividido e malha de arames

O topo da ilha é construído com anéis e setores triangulados. A base arredondada também é subdividida em faixas de triângulos. A tecla F alterna o preenchimento pelo desenho das três arestas de cada triângulo, usando `gl.LINES`.

O relevo da praia é calculado pela função `alturaAreia`, que faz a areia descer suavemente até a região submersa.

### 4. Texturas no chão e no moinho

A areia utiliza uma textura procedural de grãos, criada em uma imagem de 128 × 128 pixels. O moinho recebe uma textura procedural de madeira de 256 × 256 pixels, com veios e juntas entre tábuas. As texturas usam coordenadas UV, repetição e mipmaps e são combinadas com as cores dos materiais e a iluminação.

### 5. Modelo tridimensional em OBJ

A estrela-do-mar é carregada de `assets/modelos/estrela-do-mar.obj` por um parser próprio. O leitor interpreta vértices e faces, aceita índices positivos e negativos, triangula as faces em leque e calcula normais para a iluminação.

O Squirtle e os demais objetos são montados com geometrias geradas pelo código. O arquivo OBJ da estrela é identificado no projeto como um modelo original low-poly.

### 6. Líquido com ondas e transparência

A superfície do mar é recortada a partir da área submersa do terreno e subdividida para permitir a deformação. O vertex shader desloca a altura dos vértices por uma onda senoidal.

```glsl
y += amplitudeOnda * sin(numeroOnda * x + frequenciaOnda * tempoOnda) * influenciaOndas;
```

A influência diminui junto à costa. A normal da água é ajustada pela derivada da onda. O fragment shader combina tons de azul conforme a profundidade e acrescenta um padrão animado de reflexos.

A água é desenhada depois dos objetos opacos, com `gl.SRC_ALPHA` e `gl.ONE_MINUS_SRC_ALPHA`, mantendo o teste de profundidade e desativando temporariamente a escrita nesse buffer. A prancha acompanha a altura e a inclinação calculadas a partir da mesma onda.

### 7. Poses alternativas do personagem

A tecla P alterna entre o Squirtle em pé surfando, deitado na prancha e descansando na espreguiçadeira da cabana. As poses alteram a posição, a orientação e a disposição dos membros. Óculos, sunga e boné acompanham as transformações do personagem, e a hélice continua girando nas três poses.

### 8. Iluminação e ciclo dia/noite

A cena usa iluminação de Phong por fragmento, com componentes ambiente, difusa e especular. Os materiais possuem coeficientes próprios para areia, terra, madeira, folhas, plástico, conchas e água.

A luz direcional acompanha o Sol durante o dia e a Lua durante a noite. As cores da luz, do ambiente e do céu passam por dia, crepúsculo e noite. As estrelas têm visibilidade e cintilação animadas. A tecla L alterna a iluminação.

### 9. Neblina

A tecla N liga e desliga a neblina. O efeito é calculado por fragmento a partir da distância entre a câmera e o ponto no mundo. A mistura aumenta suavemente entre 10 e 60 unidades e utiliza a cor atual do céu, acompanhando o ciclo de dia e noite.

### 10. Câmeras e redimensionamento

Há uma câmera automática para apresentar a ilha e uma câmera orbital manual com mouse e WASD. A projeção perspectiva considera a proporção atual do canvas e é atualizada ao redimensionar a janela, preservando a aparência dos objetos.

A implementação em WebGL2 utiliza matrizes próprias de modelo, visão e projeção, além de shaders para a iluminação. Essa é a adaptação dos conceitos de perspectiva e iluminação do enunciado para o pipeline programável.

## (e) Créditos

### Código e referências

- Modelagem, geração de geometrias, matrizes, texturas procedurais, parser OBJ e shaders desenvolvidos no projeto, com assistência de IA durante a implementação.
- A organização da câmera por posição, alvo e vetor para cima foi estudada a partir do exemplo didático do professor Flávio Coutinho. [Sistema Solar, de fegemo](https://github.com/fegemo/ufci-cg-solar-system)

### Modelos e texturas

- Geometrias do cenário e do personagem construídas no código do projeto.
- Estrela-do-mar carregada do arquivo OBJ incluído em `assets/modelos`.
- Texturas de areia e madeira geradas proceduralmente em `chao.js` e `texturas.js`.

Squirtle pertence à franquia Pokémon. Este projeto é uma representação acadêmica, sem fins comerciais.

## Organização dos arquivos

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `index.html` e `style.css` | Página e canvas do diorama |
| `src/main.js` | Inicialização e loop de desenho |
| `src/webgl.js` e `src/shaders.js` | Contexto WebGL2 e compilação dos shaders |
| `src/matrizes.js` | Matrizes e operações usadas nas transformações |
| `src/camera.js`, `src/mouse.js` e `src/teclado.js` | Câmeras e controles |
| `src/terreno.js` e `src/chao.js` | Relevo, base da ilha, textura de areia e wireframe |
| `src/praia.js` e `src/ondas.js` | Água, recorte da costa e parâmetros das ondas |
| `src/formas.js` | Geometrias reutilizáveis |
| `src/moinho.js` e `src/texturas.js` | Moinho hierárquico e textura de madeira |
| `src/palmeira.js`, `src/conchas.js` e `src/cabana.js` | Objetos do cenário |
| `src/tartaruga.js` e `src/bone.js` | Squirtle, poses, prancha e boné com hélice |
| `src/iluminacao.js` e `src/neblina.js` | Iluminação, dia/noite e neblina |
| `src/obj.js` e `assets/modelos/` | Leitura e armazenamento do modelo OBJ |
| `shaders/` | Vertex shader e fragment shader em GLSL ES 3.00 |
