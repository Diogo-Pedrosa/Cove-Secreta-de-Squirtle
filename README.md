# Cova Secreta de Squirtle

Trabalho 2 de Computação Gráfica, feito com HTML, CSS, JavaScript e WebGL2,
sem frameworks ou bibliotecas gráficas.


Por enquanto, a cena tem um chão circular com cor de areia, uma câmera aérea
com perspectiva e um moinho d'água no centro. A roda e as pás giram no eixo X.
A areia usa uma textura procedural. As peças de madeira do moinho também
recebem uma textura procedural com veios e juntas entre tábuas.

A ilha tem areia no topo plano e uma meia esfera de terra embaixo, formada
por 16 anéis que diminuem até fechar no fundo. O raio e a profundidade sãoç
12; a variável `profundidade` em `chao.js` permite achatar essa base.
O centro do topo continua na altura zero, sem mudar a posição do moinho.
Em um dos lados, a areia desce suavemente até uma praia com água azul
transparente. A água ocupa somente a área rebaixada e termina na borda da
ilha, mantendo o formato de diorama. Por enquanto ela é parada, sem ondas.
A praia foi ampliada para abrir espaço para um Squirtle sobre uma prancha.
O personagem é um modelo simples feito de esferas e cubos, ainda sem OBJ.
Ele e a prancha balançam juntos e se deslocam levemente sobre o mar.

Controles:

- `1`: câmera automática a ~45º girando ao redor do centro da ilha.
- `2`: câmera orbital controlada pelo arraste do mouse.
- `P`: alternar entre as 3 poses da tartaruga (surfando, deitada na prancha e descansando na espreguiçadeira).
- `L`: ativar/desativar a iluminação dinâmica (modelo de Phong).
- Arrastar com o botão esquerdo (na câmera `2`): girar ao redor do moinho e mudar a inclinação.
- Rodinha do mouse: aproximar e afastar.
- `W` / `S`: aproximar e afastar a câmera.
- `A` / `D`: girar ao redor da ilha. WASD ativa o modo orbital manual.

O mouse usa o deslocamento em pixels. A distância fica entre 8 e 55 e a inclinação não passa por baixo
do chão nem vira a câmera de cabeça para baixo.

Arquivos:

- `index.html`: página e canvas que ocupa toda a janela.
- `style.css`: aparência da página.
- `src/main.js`: ponto de entrada, junta as partes.
- `src/webgl.js`: contexto WebGL2 e limpeza da tela.
- `src/shaders.js`: leitura, compilação e ligação dos shaders.
- `src/chao.js`: vértices e desenho do chão.
- `src/terreno.js`: malha do topo e altura da areia na praia.
- `src/praia.js`: recorte e desenho da água no canto da ilha.
- `src/squirtle.js`: personagem, prancha e animação de surf.
- `src/camera.js`: câmera orbital e limites de distância e inclinação.
- `src/mouse.js`: arraste, captura do ponteiro e rodinha do mouse.
- `src/teclado.js`: estado das teclas WASD e liberação ao perder o foco.
- `src/texturas.js`: geração da textura de madeira do moinho.
- `src/matrizes.js`: contas de perspectiva e visão, sem biblioteca externa.
- `src/formas.js`: cubo, cilindro, aro, telhado e esfera reutilizáveis.
- `src/moinho.js`: montagem do moinho e hierarquia da roda.
- `src/iluminacao.js`: ciclo dia/noite com Sol, Lua e estrelas dentro do domo, luz direcional dinâmica, materiais de Phong e alternância pela tecla `L`.
- `shaders/base.vert` e `shaders/base.frag`: shaders em GLSL ES 3.00 com ondas e iluminação de Phong.

O moinho combina formas simples com matrizes de posição, rotação e escala.
As peças fixas usam a matriz da base; a roda usa uma matriz deslocada até o
eixo e rotacionada com o tempo. Aros, raios e pás recebem essa mesma matriz
como pai, por isso giram juntos. A cena conta com ciclo de dia e noite em que o Sol e a Lua percorrem o céu dentro do domo da ilha, alterando a direção e a cor da iluminação dinâmica de Phong (componentes ambiente, difusa e especular) e do céu ao longo do dia, pôr do sol e noite estrelada, podendo ser alternada com `L`.

Referência para a câmera: [Sistema Solar, de fegemo](https://github.com/fegemo/ufci-cg-solar-system/blob/main/main.vanilla.js).
Foi usada a ideia de definir a câmera por posição, alvo e vetor para cima
para calcular a matriz de visão. As contas continuam nos módulos do projeto,
sem usar TWGL.
O controle orbital com mouse foi acrescentado nesta implementação; a versão
consultada do exemplo usa vistas predefinidas, tecla C e uma lista de seleção.
