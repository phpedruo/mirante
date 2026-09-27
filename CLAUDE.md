# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev      # servidor de desenvolvimento em http://localhost:4321
npm run build    # gera o site estático em dist/
npm run preview  # serve o dist/ já construído
npm run check    # checagem de tipos e de templates do Astro
```

O Astro 7 exige Node 22.12 ou mais recente; o `.nvmrc` fixa o 22 para os serviços de deploy.

Não há suíte de testes. A verificação é `npm run build` (que falha em erro de template ou de tipo) mais conferência visual no navegador.

## O negócio

A Mirante é uma **fábrica** de fardamentos e camisas em Paulista – PE, com produção interna em galpão próprio: corte, costura e estampa. Personaliza por sublimação, serigrafia, bordado e aplique, e entrega no próprio veículo.

Linhas de produto (fonte: fachada e Instagram): fardamento escolar, fardamento pesado/industrial, camisas polo, camisas promocionais, batas e jalecos, aventais, camisas UV, camisas para corrida, camisas para jogos internos, roupas de ballet, shorts e short-saia, brindes e bandeiras. Na página elas aparecem agrupadas por público em `productCategories` (`site.ts`), com as peças de cada grupo citadas na descrição do card.

O fluxo comercial é consultivo: contato pelo WhatsApp ou por um consultor → o cliente envia o logo e as referências → **orçamento**, que só é feito depois delas → a fábrica devolve a **prévia** da peça → aprovação → produção → entrega. A página não vende, ela qualifica e encaminha para o contato.

## Tom da copy

A marca tem uma fórmula própria, e a página segue ela: **uma pergunta que nomeia a necessidade, seguida do slogan como resposta** — "Fardamento para a sua empresa? Chama que a Mirante faz!".

Três regras vindas de correções do cliente:

- **Nada de construção por contraste.** "A gente não revende, a gente fabrica" e variações foram rejeitadas explicitamente.
- **Não posicionar contra a concorrência.** O argumento é a qualidade da peça — tecido, costura, acabamento, conferência — não a comparação com terceiros.
- **Preço não se menciona.** A frase sobre orçamento justo ficava na faixa abaixo do hero, e o cliente pediu para tirar a faixa inteira. Nada de tabela de preços, seção dedicada ou frase de reposição. **"Entrega grátis"** chegou a ficar na faixa de números do hero, a pedido do cliente, e saiu: sem número ela lia como sobra ao lado dos outros dois, e prometia sem condição o que o FAQ diz ser combinado no WhatsApp. Se o cliente pedir de volta, o lugar é outro — não a faixa de números.

- **A Mirante não cria a arte.** Quem manda o logo e as referências é o cliente; a fábrica
  devolve uma prévia da peça para aprovação. Nada de "montamos a arte", "proposta visual" ou
  "arte da peça" como se fosse trabalho da casa — o que se aprova é a **prévia da peça**. E
  nada de "mockup": é jargão de design, e a página fala a língua do cliente.
- **Uma linha, não um parágrafo.** Afirmação de apoio — um diferencial, um padrão de qualidade —
  cabe em uma frase, e entra na abertura da própria seção, com destaque por peso de fonte ou um
  traço em `--accent`. Bloco com fundo, título e parágrafo lê como caixa de dica ou seção nova, e
  o visitante pula. Foi por isso que o padrão de matéria-prima da seção de tecidos (`fabricsNote`)
  encolheu de um bloco para uma linha.

O pedido mínimo é de 30 peças, mas não deve se repetir pela página — aparece só na resposta do FAQ.

## Marca

Cores oficiais, extraídas do logo. Estão em `src/styles/global.css` como custom properties; use os tokens, não valores soltos.

```css
--blue-900: #0a2c85;  --blue-700: #0c37a8;  --blue-600: #1440bd;
--orange-600: #dc6800; --orange-500: #f07a1a; --orange-100: #fde9d4;
```

Acima dessa escala existe uma camada de **papéis semânticos**, e é ela que os componentes
devem usar: `--heading` (títulos e marcas fortes), `--accent` (laranja de texto e ícone),
`--accent-wash` (fundo laranja suave), `--on-accent` (texto sobre laranja forte),
`--brand-fill` / `--brand-fill-hover` (fundos azuis cheios, como o botão primário e o card de
contato), `--card` (fundo de card elevado) e `--link` / `--link-hover`. A escala da marca
continua sendo a cor literal do logo e não muda entre os modos.

A separação existe porque `--blue-900` tinha dois papéis opostos: cor de título, que precisa
clarear no escuro, e fundo de botão, que precisa continuar escuro. Um token só não conseguiria
ir para os dois lados. **Escrever `var(--blue-900)` num texto quebra o modo escuro.**

O mascote é a águia de camisa laranja, um render com fundo transparente em
`public/mascote-mirante.webp`, apontado por `assets.mascot`. Aparece na fala em balão e no card
de contato, e é servido em 420px — o dobro dos 210px em que aparece maior — com o original
guardado em `design/mascote-original/`. **A águia veste a camisa da marca, com "MIRANTE"
escrito no peito, então ela nunca pode ser espelhada** (`scaleX(-1)`) para mudar o lado para
onde aponta: o texto da camisa sairia invertido.

A logo é o lockup oficial em vetor, servido de `public/` por `Logo.astro` — cabeçalho, hero e
rodapé usam o mesmo componente, e o tamanho vem de `--logo-height`, que o ancestral redefine.
São dois arquivos porque o azul do logo sumiria no escuro: `logo-mirante-dark.svg` é a mesma
arte com o azul trocado por branco, e o CSS mostra um ou outro.

Tipografia: **Archivo** (variável) para tudo, **Archivo Black** só para o slogan e o nome na marca. As duas são auto-hospedadas via Fontsource — não voltar para o CDN do Google Fonts, que adiciona uma origem externa no caminho crítico.

Nome: Mirante Camisas e Fardamentos. Slogan: "Chama que a Mirante faz!".
Endereço: Av. Antônio Cabral de Souza, 2806 — Maranguape II, Paulista – PE, 53409-420.
WhatsApp: (81) 9.8104-0516 — este é o número escolhido para o site; as artes antigas mostram outros três, que **não** devem ser usados.

## Arquitetura

Site estático em Astro, uma página só (`src/pages/index.astro`), montada por componentes em `src/components/`, mais a página de erro (`src/pages/404.astro`), onde o mascote dá a notícia em balão. A 404 reaproveita o cabeçalho e o rodapé, e é por isso que os links deles levam `/` na frente (`/#produtos`): numa URL inexistente, `#produtos` sozinho apontaria para a própria página de erro. Sem framework de UI e sem ilha hidratada: os poucos comportamentos interativos são scripts próprios de cada componente.

Dois pontos concentram as decisões e é por eles que se deve começar:

- **`src/data/site.ts`** é a fonte única de conteúdo e configuração — dados de contato, endereço, lista de produtos, FAQ, clientes e os campos ainda por preencher. Alterar conteúdo aqui, não dentro dos componentes. Os campos vazios são intencionais: cada um esconde ou suaviza o trecho correspondente na página em vez de exibir um placeholder para o visitante.
- **`src/scripts/animations.ts`** concentra toda a animação GSAP da página. Nenhum componente anima por conta própria.

Convenções que atravessam os componentes:

- Elementos que entram animados levam `data-anim="<grupo>"`. O CSS os esconde **apenas** quando o `<html>` tem a classe `js-anim`, que um script inline adiciona antes da primeira pintura. Se o JS falhar ou estiver desligado, nada some.
- As esteiras (vitrine de produtos e logos de clientes) duplicam a lista no HTML e o GSAP anima `xPercent` até -50%, o que faz o laço fechar sem salto. As cópias levam `aria-hidden`.
- **A esteira das categorias é conduzida pelo visitante** (`data-marquee-drag`): arrastar move o
  trilho na mesma medida do dedo, a esteira fica pausada durante o gesto e volta a andar ao
  soltar — por isso ela, ao contrário da dos clientes, **não pausa no hover**. O arrasto não mexe
  no trilho por fora: ele move o progresso do próprio tween, e é isso que faz a esteira retomar de
  onde a mão soltou, sem salto. No desktop os dois botões de seta (`data-marquee-step`) dão o
  mesmo empurrão de um card por clique; eles só aparecem com `html.js` e em `pointer: fine`,
  porque no toque o dedo já faz esse papel.
- O accordion do FAQ nasce **todo aberto** no HTML e o JS fecha os itens ao carregar, para a página continuar legível sem JavaScript.
- O iframe do Google Maps só é criado quando a seção entra na viewport, via `IntersectionObserver`.
- **Espaçamento vertical.** São três degraus, e o que faz a página ler como seções separadas é a
  distância entre eles — quando o salto de uma seção para a outra fica parecido com o salto de um
  bloco para o outro dentro dela, tudo vira uma coisa só. `--section-y` é o espaço *entre* duas
  seções; seção sobre o mesmo fundo usa `--section-pad` (a metade), então o encontro de duas soma
  exatamente `--section-y`. `--band-pad` é o padding interno de seção em faixa de outro fundo
  (clientes, FAQ e rodapé): é maior que `--section-pad` porque ali o espaço é interno à faixa e a
  troca de cor já marca a separação. `--intro-gap` é a distância do bloco de abertura (eyebrow +
  h2 + lead) até o conteúdo da seção, e é o menor dos três de propósito. **Nenhum componente
  inventa o próprio valor** — sub-bloco dentro de uma seção longa se declara como múltiplo de
  `--intro-gap` (é o que a Showcase faz em "Por categoria"), nunca como pixel solto.
- **Alternância de fundo.** As seções não se separam só por espaço: `--surface` e `--surface-2` se
  revezam para o olho achar as fronteiras. Hoje a faixa cinza cai nos clientes, no FAQ e no
  rodapé, o que quebra a sequência de brancos do meio da página. Seção que virar faixa precisa que
  seus cards internos subam de camada (`--card`), senão eles somem dentro do próprio fundo — foi
  por isso que as placas de logo dos clientes deixaram de ser `--surface-2`.
- **O outdoor do hero** (`heroSlides` em `site.ts`) empilha o conteúdo no mesmo quadro e troca
  puxando o atual para fora enquanto o próximo entra. As duas metades precisam da mesma duração
  e da mesma ease: é isso que faz as bordas se encontrarem exatamente, sem abrir um vão do
  fundo no meio do quadro. **No celular o quadro sangra até as duas bordas da tela**, sem
  canto, por margem negativa da calha — é por causa dela que o hero leva `overflow-x: clip`,
  senão a sobra vira rolagem horizontal. **No desktop ele fica na prumada do conteúdo**, com os
  quatro cantos arredondados: sangrando para a direita ele saía do alinhamento das outras
  seções, e com o lado direito reto mas já dentro da página ele lia como torto. Em nenhum dos
  dois há sombra — com sombra a imagem lia como cartão colado sobre a página.
  São **dois tipos de conteúdo**, e a diferença é de corte: `kind: 'foto'` preenche o quadro e
  aceita perder as bordas, que é o que foto de gente fardada pede; `kind: 'arte'` aparece
  inteira sobre o azul da marca, porque em peça de Instagram o texto encosta na borda e
  qualquer corte come palavra. Cada item aceita ainda um `promo` opcional — selo, título e
  linha de apoio sobre um véu escuro —, que é o espaço da fábrica para anunciar campanha sem
  mexer em componente. O recado sobe **depois** que a imagem assenta: entrando junto com ela em
  movimento, o texto fica ilegível justamente na hora em que pede leitura.
  A régua laranja no rodapé do quadro **é o próprio relógio da passagem**, não um enfeite
  sincronizado por fora: é o fim do tween dela que chama a troca, e é por isso que pausar no
  hover para as duas coisas juntas. Ela nasce escondida e só aparece quando a passagem começa
  de fato. Lista vazia mostra o placeholder hachurado, uma imagem só deixa o quadro parado, e
  sem JavaScript (ou com "reduzir movimento") ele fica na primeira imagem.

- **Os números da faixa abaixo do hero** giram como um caça-níquel: cada dígito é um rolo de
  vinte casas (0 a 9 duas vezes) que sobe uma volta inteira antes de parar na sua. A posição de
  repouso está declarada no CSS e o GSAP mira exatamente nela, então sem JavaScript o número já
  nasce certo em vez de travar no zero — **mudar o número de casas exige mudar os dois lugares**.
  A largura tabular não é enfeite: sem ela cada dígito ocupa um espaço diferente e o número
  treme na horizontal enquanto gira.
- **Modo escuro.** O tema mora em `data-theme` no `<html>`, escrito pelo script inline do
  `Base.astro` **antes da primeira pintura** (senão a página pisca branca). A ordem é escolha
  salva em `localStorage['mirante-tema']` > claro. A **preferência do sistema não é consultada**:
  o cliente pediu que o site sempre abra no claro, que é o design aprovado, mesmo para quem usa
  o navegador no escuro — o escuro só aparece se o visitante apertar o botão. Sem JavaScript o
  atributo nunca aparece e fica o claro também. O botão de troca fica no
  cabeçalho e só aparece com a classe `js`, que o mesmo script adiciona. Todo o modo escuro é
  redefinição de token em `:root[data-theme='dark']` no `global.css`; quando um componente
  precisa de um ajuste próprio (uma sombra, um degradê, uma trama), ele escreve a exceção no
  próprio `<style>` com `:global(html[data-theme='dark'])` como ancestral, e não cria token
  novo. **Não existe `@media (prefers-color-scheme)` no CSS** — nem no script: quem manda é o
  atributo, e só o botão o muda.
- **As três técnicas** (`Techniques.astro`) usam sempre o mesmo truque: o palco nasce com a palavra pronta e uma cobertura da cor do palco por cima; a cobertura desliza para a direita enquanto o conteúdo dentro dela desliza para a esquerda na mesma duração e mesma ease, o que deixa a palavra "por fazer" parada e faz só a boca da cobertura avançar. É por isso que as duas metades do par (`data-tech-wipe` e `data-tech-wipe-inner`) nunca podem receber durações ou eases diferentes.
  **As três usam esse mesmo par, sem exceção** — a palavra sempre se pinta da esquerda para a
  direita, e o que muda entre elas é só a ferramenta que passa no trilho: a agulha do bordado, o
  rodo da serigrafia e o cilindro da calandra na sublimação. A sublimação já teve uma chapa que
  descia e trocava a palavra de uma vez; foi trocada porque a troca instantânea destoava das
  outras duas — o cilindro existe justamente para justificar a passagem horizontal. O vapor da
  sublimação fica **depois** da cobertura no HTML, para subir por cima do que já foi prensado, e
  cada baforada é cronometrada pelo instante em que o cilindro passa por cima dela.
  Bordado e sublimação são máquina e andam em ease `none`; só o rodo da serigrafia, que é mão
  humana, acelera e desacelera.

## LGPD

A política de privacidade **não tem página própria, por decisão do cliente**: ela mora num
diálogo compacto (`PrivacyDialog.astro`, um `<dialog>` nativo), aberto pelo link abaixo do botão
do formulário e pelo rodapé. O que mantém isso de acordo com a lei é o link estar **no ponto da
coleta**, ao lado do envio — ele não pode sair dali. Os gatilhos são `<button>` com
`commandfor`/`command`, que funcionam sem JavaScript nos navegadores atuais; o script do
componente cobre os demais.

O texto descreve o que o site faz **hoje**, e é compromisso público:

- **Qualquer terceiro novo** — analytics, pixel, chat, fonte de CDN — ou **campo novo no
  formulário** exige atualizar o texto do diálogo e a data em `privacy.updatedAt` (`site.ts`) no
  mesmo commit. Hoje ele afirma que o site não usa cookies de publicidade nem de análise; a
  decisão sobre analytics, lá no checklist de lançamento, passa por aqui.
- **O formulário não tem caixa de consentimento, de propósito.** O pedido de orçamento parte do
  próprio visitante e se apoia em "procedimentos preliminares de contrato" (art. 7º, V). O que a
  lei pede ali é transparência: a linha abaixo do botão, com o link para a política.
- **O mapa do Google é o único terceiro que carrega sem ação do visitante**, e a política o
  declara. Carregar só ao clicar foi proposto e **recusado pelo cliente**: o mapa já pronto é
  mais adequado para a página. Não reabrir a questão sem pedido dele.

## Restrições

- **Meta de performance: rodar bem em celular e computador intermediário.** É a razão da escolha do Astro. Não adicione dependências de runtime sem necessidade; hoje só o GSAP vai para o bundle do cliente.
- Anime apenas `transform` e `opacity`.
- Toda animação passa por `gsap.matchMedia()` com `prefers-reduced-motion`. O accordion do FAQ é a exceção: ele precisa funcionar sempre, então fica fora do matchMedia e só zera a duração.

## Pendências

- **Chave do Web3Forms** (`formAccessKey` em `site.ts`): sem ela o formulário orienta o visitante a usar o WhatsApp em vez de enviar. O build emite um aviso enquanto estiver vazia.
- **Dados a preencher** em `site.ts`: e-mail comercial, prazo de produção, região de entrega e condições de pagamento. Horário, CNPJ e razão social já estão preenchidos.
- **Alinhamento com o Google Business Profile.** O perfil já existe, e o site espelha dele o endereço, o telefone, o horário (`openingHours` e `openingHoursSpec`, que precisam mudar juntos) e o pino (`address.geo`). **Qualquer mudança num lado precisa ir para o outro**: dado divergente entre site e perfil enfraquece a busca local. O mapa e a rota da seção de localização buscam pelo nome da empresa mais o endereço, para abrir no perfil e não num alfinete de rua. O tipo `ClothingStore` dos dados estruturados em `Base.astro` espelha a categoria atual do perfil ("Loja de roupa"); se a categoria mudar, o tipo muda junto. A foto da fachada (`assets.facade`) abre o card de endereço; o original de 680px fica em `design/fachada-original/`.
- **Fotos dos tecidos** (`photo` em cada item de `fabrics`): os sete cards já têm imagem, em `public/malhas/<slug>.webp`. Os originais ficam em `design/malhas-originais/`, junto com as alternativas que não entraram (PV cinza e laranja, piquet branco). Os `.webp` são faixas 2,5:1 de até 760px de largura, em qualidade 80, com ~290 KB somados; a do UV sai com só 500px, porque o original é pequeno. As cores foram escolhidas para nenhum card repetir a do vizinho. **Falta confirmar a origem:** são fotos de rolo de tecido no estilo de catálogo de fornecedor. Se vierem de fornecedor, e não da fábrica, tudo bem mostrar o tecido, mas a página não pode apresentá-las como fotos da própria fábrica. A foto do card UV é de poliamida, então confirmar que é essa a malha UV da fábrica.
- **Artes do outdoor** (`heroSlides` em `site.ts`): o quadro já roda com três peças reais — polo bordada, bata e camisa social, em `public/hero/`. São o que sobrou da seleção de "Por categoria", recortadas do original em `design/produtos-originais/` na proporção 1,25:1 do quadro, qualidade 80, ~70 KB somadas; não foram ampliadas, então a camisa social entrega só 1,2x a densidade do quadro. **Ainda falta o principal:** foto de gente fardada, que é o que o hero pede — as três de hoje são peças soltas, sem contexto de uso. Servem também as artes do Instagram. A do avental Pitú, que seria a mais adequada por trazer logo e slogan, ficou de fora porque o arquivo tem 399px de largura e o quadro pede uns 650. O quadro corta a imagem para preenchê-la, então arte com texto colado na borda perde pedaço, e refazer um corte é recortar do original, nunca do `.webp`. Lista vazia volta a mostrar o placeholder hachurado.
- **Números da faixa do hero** (`heroStats` em `site.ts`): "10+ anos", "1000+ clientes" e "100% produção própria" vieram do cliente ou da descrição do negócio, e nenhum foi conferido contra o registro da empresa. O dos 100% é o mais delicado: se alguma etapa sai para fora — bordado terceirizado, por exemplo —, ele não se sustenta. Confirmar os três antes do lançamento.
- **Lista de tecidos** (`fabrics` em `site.ts`): a grade fecha com o card "E muito mais" (`fabricsMore`), que diz que a variedade não para ali sem citar tecido nenhum — ele não pode prometer malha que a fábrica não tenha. A lista atual é uma proposta baseada no que uma confecção de fardamento costuma trabalhar. **Confirmar com a fábrica** quais tecidos ela de fato usa e como prefere chamá-los antes do lançamento.
- **Fotos reais** da fábrica e dos produtos. São o ativo mais importante da página, e o resto da página ainda está no placeholder hachurado. Nunca substituir por banco de imagens genérico passado como se fosse da empresa. **"Por categoria" já está pronta**: as oito fotos vieram do cliente e estão em `public/produtos/<slug>.webp`, apontadas por `photo` em `productCategories`. Os arquivos originais ficam em `design/produtos-originais/` — fora de `public/`, para não irem no build. Os `.webp` são recorte 584×448 (o dobro do card, para tela retina) em qualidade 80, ~110 KB somados; o corte foi escolhido peça a peça para o rosto sair do quadro e a peça ocupar o centro. Refazer um corte é recortar do original, não do `.webp`.
- **Favicon.** Resolvido com a cabeça da águia que a fábrica mandou (`design/favicon-original/icon-mirante.svg`): apesar da extensão, o arquivo é um PNG de 195×68 embutido num SVG, não vetor. Dele saem `public/favicon.ico` (16, 32 e 48px) e `public/apple-touch-icon.png` (180px, quadrado cheio, porque o iOS arredonda sozinho e pinta de preto o que for transparente). A águia vai sobre fundo branco porque, solta, sumia em aba escura. A águia tem só ~80px de largura no original, então o ícone de 180px sai ampliado e um pouco suave; **se chegar o símbolo em vetor de verdade**, regerar os dois a partir dele.
- **Logos de clientes** (`clients` em `site.ts`): a esteira já mostra dez marcas, e **nenhuma autorização foi confirmada**. Confirmar cada uma com a fábrica antes do lançamento; a que não for autorizada sai da lista. Vale o mesmo para a marca Agrotorta, que aparece no peito da polo do primeiro slide do outdoor (`public/hero/polo-bordada.webp`).
- **LGPD, antes do lançamento.** (1) A política promete guardar os registros de acesso por seis meses, como exige o Marco Civil: conferir se a hospedagem escolhida guarda os logs por esse prazo — plano gratuito costuma guardar menos. (2) O canal de dados pessoais hoje é só o WhatsApp; o e-mail comercial, quando preenchido, entra sozinho na política. (3) O texto foi escrito sem revisão jurídica — se o cliente tiver advogado, vale a leitura dele.
- **Imagem de Open Graph** (`seo.ogImage` em `site.ts`): 1200×630, usada quando o link é compartilhado. Vazia hoje, então a tag nem é gerada.
- **Performance das animações** — revisão adiada a pedido do cliente, mas os gargalos já estão mapeados: o FAQ chama `ScrollTrigger.refresh()` no `onComplete` de *cada* painel (até 6 recálculos globais por clique, mais 6 no carregamento); o fechamento inicial usa `gsap.to` com duração 0 onde bastaria `gsap.set`; o `ScrollTrigger` que acelera as esteiras não tem `trigger`/`start`/`end`, então `getVelocity()` e o `setTimeout` rodam a cada tick de scroll mesmo com as esteiras fora da tela; os dois trilhos carregam `will-change: transform` permanente e nunca param; e o accordion anima `height`, contra a regra de animar só `transform` e `opacity`. Opção maior: as entradas são todas `once: true` e caberiam num `IntersectionObserver`, o que tiraria o ScrollTrigger (~12KB gz) do bundle.

## Checklist de lançamento (SEO)

O site está deliberadamente configurado para **não ser indexado** enquanto não for lançado — evita que uma URL de teste ou domínio provisório fique indexada e depois compita com o domínio final. No dia do lançamento, nesta ordem:

1. Comprar/apontar o domínio e preencher `site: 'https://...'` em `astro.config.mjs`.
2. Descomentar o import e a integração do `@astrojs/sitemap` no mesmo arquivo (já instalado).
3. Mudar `launch.isLive` para `true` em `src/data/site.ts`. Isso, sozinho, muda o `<meta name="robots">` de todas as páginas e o `robots.txt` de "bloquear tudo" para "liberar tudo" — nenhum outro arquivo precisa mudar.
4. Rodar `npm run build` e conferir em `dist/robots.txt` que saiu `Allow: /` e uma linha `Sitemap:`.
5. Cadastrar o domínio no **Google Search Console** (verificação por DNS ou meta tag) e enviar a URL do sitemap gerado (`/sitemap-index.xml`).
6. **Google Business Profile** — para um negócio físico local, ele pesa tanto quanto o site em resultados de busca e é o que alimenta o Google Maps. O perfil já existe, mas **não foi reivindicado** pela empresa (mostra "É proprietário desta empresa?"); a verificação leva dias, então começa antes do lançamento. Depois de verificado: trocar o botão "Site", que hoje aponta para o Instagram, pelo domínio novo; rever a categoria principal, que está como "Loja de roupa"; escrever a descrição no tom da página; e adicionar o Instagram. O nome do perfil fica como está — palavra-chave no nome viola as regras do Google.
7. Preencher `seo.ogImage` com uma imagem 1200×630 para o link ficar bonito ao ser compartilhado no WhatsApp/Instagram.

Medir depois do lançamento: Search Console (impressões, cliques, posição média, cobertura de indexação) é gratuito e não pesa no site. Para analytics de comportamento, qualquer opção teria que entrar como script de terceiro — isso é uma decisão pendente, a ser tomada quando o lançamento estiver mais próximo, pesando o custo de performance de cada ferramenta.

## Referência de design

O mockup aprovado é a prancha "Versão refinada — UX 2026" do canvas em `design/` (arquivos `.dc.html`, montados com a skill `design`). As outras duas pranchas são a versão anterior, mantidas para comparação.

A implementação **já passou da prancha** em algumas seções, por pedidos do cliente posteriores ao mockup: o hero abre com a logo grande no lugar do selo de texto e o espaço ao lado virou um outdoor, que passa as artes e fotos da fábrica; a faixa de adjetivos abaixo do hero virou números, saiu de vez para dar lugar à seção das três técnicas — Bordado, Serigrafia e Sublimação, cada palavra com uma animação que imita o gesto da própria estamparia — e depois voltou menor, como rodapé do próprio hero, com os números girando ao abrir a página; a antiga "É avental? É bata?" virou a seção de tecidos e malhas, cada tecido com a sua imagem, com os produtos agrupados por categoria depois; a seção "A fábrica" foi removida e seus pontos de qualidade se mudaram para a seção de tecidos; o recado sobre visual padronizado virou fala do mascote, em balão; e o formulário troca de lugar com um painel de agradecimento depois do envio. Onde a prancha e a página divergirem, **a página é a referência mais nova** — as pranchas não foram regeradas.

## Agent skills

Configuração que as skills de engenharia leem. Os arquivos em `docs/agents/` estão em inglês de propósito: são lidos por outras skills, e algumas linhas são procuradas literalmente (a flag de PRs e os nomes canônicos das labels).

### Issue tracker

Issues e specs vivem no GitHub Issues deste repositório (`phpedruo/mirante`), operadas pelo `gh` CLI. Ver `docs/agents/issue-tracker.md`.

### Triage labels

Vocabulário padrão, sem renomeações: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. Ver `docs/agents/triage-labels.md`.

### Domain docs

Single-context: um `CONTEXT.md` e um `docs/adr/` na raiz. Nenhum dos dois existe ainda — são criados sob demanda pela skill `/domain-modeling`, não antecipadamente. Ver `docs/agents/domain.md`.
