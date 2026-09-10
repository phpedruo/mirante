# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev      # servidor de desenvolvimento em http://localhost:4321
npm run build    # gera o site estático em dist/
npm run preview  # serve o dist/ já construído
npm run check    # checagem de tipos e de templates do Astro
```

Não há suíte de testes. A verificação é `npm run build` (que falha em erro de template ou de tipo) mais conferência visual no navegador.

## O negócio

A Mirante é uma **fábrica** de fardamentos e camisas em Paulista – PE, com produção interna em galpão próprio: corte, costura e estampa. Personaliza por sublimação, serigrafia, bordado e aplique, e entrega no próprio veículo.

Linhas de produto (fonte: fachada e Instagram): fardamento escolar, fardamento pesado/industrial, camisas polo, camisas promocionais, batas e jalecos, aventais, camisas UV, camisas para corrida, camisas para jogos internos, roupas de ballet, shorts e short-saia, brindes e bandeiras. Na página elas aparecem agrupadas por público em `productCategories` (`site.ts`), com as peças de cada grupo citadas na descrição do card.

O fluxo comercial é consultivo: contato pelo WhatsApp ou por um consultor → proposta com a arte da peça e o orçamento → aprovação → produção → entrega. A página não vende, ela qualifica e encaminha para o contato.

## Tom da copy

A marca tem uma fórmula própria, e a página segue ela: **uma pergunta que nomeia a necessidade, seguida do slogan como resposta** — "Fardamento para a sua empresa? Chama que a Mirante faz!".

Três regras vindas de correções do cliente:

- **Nada de construção por contraste.** "A gente não revende, a gente fabrica" e variações foram rejeitadas explicitamente.
- **Não posicionar contra a concorrência.** O argumento é a qualidade da peça — tecido, costura, acabamento, conferência — não a comparação com terceiros.
- **Preço não se menciona.** A frase sobre orçamento justo ficava na faixa abaixo do hero, e o cliente pediu para tirar a faixa inteira. Nada de tabela de preços, seção dedicada ou frase de reposição. A única exceção hoje é **"Entrega grátis"**, na faixa de números do hero, pedida explicitamente pelo cliente — não é abertura para trazer o resto de volta, e ela mesma ainda precisa ser confirmada (ver Pendências).

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

A logo é o lockup oficial em vetor, servido de `public/` por `Logo.astro` — cabeçalho, hero e
rodapé usam o mesmo componente, e o tamanho vem de `--logo-height`, que o ancestral redefine.
São dois arquivos porque o azul do logo sumiria no escuro: `logo-mirante-dark.svg` é a mesma
arte com o azul trocado por branco, e o CSS mostra um ou outro.

Tipografia: **Archivo** (variável) para tudo, **Archivo Black** só para o slogan e o nome na marca. As duas são auto-hospedadas via Fontsource — não voltar para o CDN do Google Fonts, que adiciona uma origem externa no caminho crítico.

Nome: Mirante Camisas e Fardamentos. Slogan: "Chama que a Mirante faz!".
Endereço: Av. Antônio Cabral de Souza, 2806 — Maranguape II, Paulista – PE, 53409-420.
WhatsApp: (81) 9.8104-0516 — este é o número escolhido para o site; as artes antigas mostram outros três, que **não** devem ser usados.

## Arquitetura

Site estático em Astro, uma página só (`src/pages/index.astro`), montada por componentes em `src/components/`. Sem framework de UI e sem ilha hidratada: os poucos comportamentos interativos são scripts próprios de cada componente.

Dois pontos concentram as decisões e é por eles que se deve começar:

- **`src/data/site.ts`** é a fonte única de conteúdo e configuração — dados de contato, endereço, lista de produtos, FAQ, clientes e os campos ainda por preencher. Alterar conteúdo aqui, não dentro dos componentes. Os campos vazios são intencionais: cada um esconde ou suaviza o trecho correspondente na página em vez de exibir um placeholder para o visitante.
- **`src/scripts/animations.ts`** concentra toda a animação GSAP da página. Nenhum componente anima por conta própria.

Convenções que atravessam os componentes:

- Elementos que entram animados levam `data-anim="<grupo>"`. O CSS os esconde **apenas** quando o `<html>` tem a classe `js-anim`, que um script inline adiciona antes da primeira pintura. Se o JS falhar ou estiver desligado, nada some.
- As esteiras (vitrine de produtos e logos de clientes) duplicam a lista no HTML e o GSAP anima `xPercent` até -50%, o que faz o laço fechar sem salto. As cópias levam `aria-hidden`.
- O accordion do FAQ nasce **todo aberto** no HTML e o JS fecha os itens ao carregar, para a página continuar legível sem JavaScript.
- O iframe do Google Maps só é criado quando a seção entra na viewport, via `IntersectionObserver`.
- **Espaçamento vertical.** `--section-y` é o espaço que deve existir *entre* duas seções. Seção sobre o mesmo fundo usa `--section-pad` (a metade), então o encontro de duas soma exatamente `--section-y`; seção em faixa de outro fundo (FAQ e rodapé) usa `--section-y` inteiro, porque aí o espaço é interno à faixa e a troca de cor já marca a separação. Nenhum componente inventa o próprio valor.
- **O outdoor do hero** (`heroSlides` em `site.ts`) empilha as artes no mesmo quadro e troca
  puxando a atual para fora enquanto a próxima entra. As duas metades precisam da mesma duração
  e da mesma ease: é isso que faz as bordas se encontrarem exatamente, sem abrir um vão do
  fundo no meio do quadro. Lista vazia mostra o placeholder hachurado, uma imagem só deixa o
  quadro parado, e sem JavaScript (ou com "reduzir movimento") ele fica na primeira arte.
- **Os números da faixa abaixo do hero** giram como um caça-níquel: cada dígito é um rolo de
  vinte casas (0 a 9 duas vezes) que sobe uma volta inteira antes de parar na sua. A posição de
  repouso está declarada no CSS e o GSAP mira exatamente nela, então sem JavaScript o número já
  nasce certo em vez de travar no zero — **mudar o número de casas exige mudar os dois lugares**.
  A largura tabular não é enfeite: sem ela cada dígito ocupa um espaço diferente e o número
  treme na horizontal enquanto gira.
- **Modo escuro.** O tema mora em `data-theme` no `<html>`, escrito pelo script inline do
  `Base.astro` **antes da primeira pintura** (senão a página pisca branca). A ordem é escolha
  salva em `localStorage['mirante-tema']` > preferência do sistema > claro; sem JavaScript o
  atributo nunca aparece e fica o claro, que é o design aprovado. O botão de troca fica no
  cabeçalho e só aparece com a classe `js`, que o mesmo script adiciona. Todo o modo escuro é
  redefinição de token em `:root[data-theme='dark']` no `global.css`; quando um componente
  precisa de um ajuste próprio (uma sombra, um degradê, uma trama), ele escreve a exceção no
  próprio `<style>` com `:global(html[data-theme='dark'])` como ancestral, e não cria token
  novo. **Não existe `@media (prefers-color-scheme)` no CSS** — a preferência do sistema é lida
  uma vez pelo script, e daí em diante quem manda é o atributo.
- **As três técnicas** (`Techniques.astro`) usam sempre o mesmo truque: o palco nasce com a palavra pronta e uma cobertura da cor do palco por cima; a cobertura desliza para a direita enquanto o conteúdo dentro dela desliza para a esquerda na mesma duração e mesma ease, o que deixa a palavra "por fazer" parada e faz só a boca da cobertura avançar. É por isso que as duas metades do par (`data-tech-wipe` e `data-tech-wipe-inner`) nunca podem receber durações ou eases diferentes.

## Restrições

- **Meta de performance: rodar bem em celular e computador intermediário.** É a razão da escolha do Astro. Não adicione dependências de runtime sem necessidade; hoje só o GSAP vai para o bundle do cliente.
- Anime apenas `transform` e `opacity`.
- Toda animação passa por `gsap.matchMedia()` com `prefers-reduced-motion`. O accordion do FAQ é a exceção: ele precisa funcionar sempre, então fica fora do matchMedia e só zera a duração.

## Pendências

- **Chave do Web3Forms** (`formAccessKey` em `site.ts`): sem ela o formulário orienta o visitante a usar o WhatsApp em vez de enviar. O build emite um aviso enquanto estiver vazia.
- **Dados a preencher** em `site.ts`: e-mail comercial, horário de funcionamento, **razão social e CNPJ** (a linha de direitos reservados do rodapé só mostra o CNPJ depois de preenchido, e usa o nome da marca enquanto não houver razão social), prazo de produção, região de entrega e condições de pagamento.
- **Fotos dos tecidos** (`photo` em cada item de `fabrics`): cada tecido tem um card com imagem, hoje no placeholder hachurado. Vale a mesma regra das outras fotos — foto da fábrica, nunca banco de imagens.
- **Artes do outdoor** (`heroSlides` em `site.ts`): hoje aponta para três placeholders coloridos em `public/hero/exemplo-*.svg`, só para mostrar a passagem funcionando. **Antes do lançamento:** soltar os arquivos reais em `public/hero/`, apontar `heroSlides` para eles e apagar os três `exemplo-*.svg`. Servem fotos de pessoas fardadas, de peças prontas e as artes do Instagram. O quadro corta a imagem para preenchê-la, então arte com texto colado na borda perde pedaço. Lista vazia volta a mostrar o placeholder hachurado.
- **Mascote** (`assets.mascot` em `site.ts`): o SVG da águia, usado na fala e no card de contato. Enquanto o caminho está vazio, os dois caem na moldura tracejada.
- **Números da faixa do hero** (`heroStats` em `site.ts`): "10+ anos" e "1000+ clientes" vieram do cliente e nunca foram conferidos contra o registro da empresa. **"Entrega grátis" é o mais delicado**: o FAQ diz que a região de entrega é combinada no WhatsApp, então uma promessa sem condição no hero pode virar cobrança depois. Confirmar as três antes do lançamento.
- **Lista de tecidos** (`fabrics` em `site.ts`): a lista atual é uma proposta baseada no que uma confecção de fardamento costuma trabalhar. **Confirmar com a fábrica** quais tecidos ela de fato usa e como prefere chamá-los antes do lançamento.
- **Fotos reais** da fábrica e dos produtos. São o ativo mais importante da página; hoje há placeholders hachurados. Nunca substituir por banco de imagens genérico passado como se fosse da empresa.
- **Favicon.** `public/favicon.svg` ainda é o desenho provisório da águia. O vetor oficial que chegou é o lockup deitado inteiro (águia + "MIRANTE" + assinatura, proporção 2,7:1) e fica ilegível espremido num quadrado de 16px. Para resolver, é preciso pedir à fábrica **só o símbolo da águia**, isolado e em quadrado — não dá para recortá-lo do lockup com segurança, porque a águia e as letras se sobrepõem no mesmo traçado.
- **Logos de clientes** (`clients` em `site.ts`): a lista está vazia e a esteira roda com placeholders. Só incluir marcas com autorização.
- **Imagem de Open Graph** (`seo.ogImage` em `site.ts`): 1200×630, usada quando o link é compartilhado. Vazia hoje, então a tag nem é gerada.
- **Performance das animações** — revisão adiada a pedido do cliente, mas os gargalos já estão mapeados: o FAQ chama `ScrollTrigger.refresh()` no `onComplete` de *cada* painel (até 6 recálculos globais por clique, mais 6 no carregamento); o fechamento inicial usa `gsap.to` com duração 0 onde bastaria `gsap.set`; o `ScrollTrigger` que acelera as esteiras não tem `trigger`/`start`/`end`, então `getVelocity()` e o `setTimeout` rodam a cada tick de scroll mesmo com as esteiras fora da tela; os dois trilhos carregam `will-change: transform` permanente e nunca param; e o accordion anima `height`, contra a regra de animar só `transform` e `opacity`. Opção maior: as entradas são todas `once: true` e caberiam num `IntersectionObserver`, o que tiraria o ScrollTrigger (~12KB gz) do bundle.

## Checklist de lançamento (SEO)

O site está deliberadamente configurado para **não ser indexado** enquanto não for lançado — evita que uma URL de teste ou domínio provisório fique indexada e depois compita com o domínio final. No dia do lançamento, nesta ordem:

1. Comprar/apontar o domínio e preencher `site: 'https://...'` em `astro.config.mjs`.
2. Descomentar o import e a integração do `@astrojs/sitemap` no mesmo arquivo (já instalado).
3. Mudar `launch.isLive` para `true` em `src/data/site.ts`. Isso, sozinho, muda o `<meta name="robots">` de todas as páginas e o `robots.txt` de "bloquear tudo" para "liberar tudo" — nenhum outro arquivo precisa mudar.
4. Rodar `npm run build` e conferir em `dist/robots.txt` que saiu `Allow: /` e uma linha `Sitemap:`.
5. Cadastrar o domínio no **Google Search Console** (verificação por DNS ou meta tag) e enviar a URL do sitemap gerado (`/sitemap-index.xml`).
6. Criar ou reivindicar o **Google Business Profile** da empresa — para um negócio físico local, isso pesa tanto quanto o site em resultados de busca e é o que alimenta o Google Maps.
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
