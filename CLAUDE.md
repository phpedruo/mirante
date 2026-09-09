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

Linhas de produto (fonte: fachada e Instagram): fardamento escolar, fardamento pesado/industrial, camisas polo, camisas promocionais, batas e jalecos, aventais, camisas UV, camisas para corrida, camisas para jogos internos, roupas de ballet, shorts e short-saia, brindes e bandeiras.

O fluxo comercial é consultivo: contato pelo WhatsApp ou por um consultor → proposta com a arte da peça e o orçamento → aprovação → produção → entrega. A página não vende, ela qualifica e encaminha para o contato.

## Tom da copy

A marca tem uma fórmula própria, e a página segue ela: **uma pergunta que nomeia a necessidade, seguida do slogan como resposta** — "Fardamento para a sua empresa? Chama que a Mirante faz!".

Três regras vindas de correções do cliente:

- **Nada de construção por contraste.** "A gente não revende, a gente fabrica" e variações foram rejeitadas explicitamente.
- **Não posicionar contra a concorrência.** O argumento é a qualidade da peça — tecido, costura, acabamento, conferência — não a comparação com terceiros.
- **Preço se menciona de leve.** Uma frase curta na faixa abaixo do hero basta; nada de tabela de preços ou seção dedicada.

O pedido mínimo é de 30 peças, mas não deve se repetir pela página — aparece só na resposta do FAQ.

## Marca

Cores oficiais, extraídas do logo. Estão em `src/styles/global.css` como custom properties; use os tokens, não valores soltos.

```css
--blue-900: #0a2c85;  --blue-700: #0c37a8;  --blue-600: #1440bd;
--orange-600: #dc6800; --orange-500: #f07a1a; --orange-100: #fde9d4;
```

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

## Restrições

- **Meta de performance: rodar bem em celular e computador intermediário.** É a razão da escolha do Astro. Não adicione dependências de runtime sem necessidade; hoje só o GSAP vai para o bundle do cliente.
- Anime apenas `transform` e `opacity`.
- Toda animação passa por `gsap.matchMedia()` com `prefers-reduced-motion`. O accordion do FAQ é a exceção: ele precisa funcionar sempre, então fica fora do matchMedia e só zera a duração.

## Pendências

- **Chave do Web3Forms** (`formAccessKey` em `site.ts`): sem ela o formulário orienta o visitante a usar o WhatsApp em vez de enviar. O build emite um aviso enquanto estiver vazia.
- **Dados a preencher** em `site.ts`: e-mail comercial, anos de mercado, horário de funcionamento, CNPJ, prazo de produção, região de entrega e condições de pagamento.
- **Fotos reais** da fábrica e dos produtos. São o ativo mais importante da página; hoje há placeholders hachurados. Nunca substituir por banco de imagens genérico passado como se fosse da empresa.
- **Logo em vetor.** O símbolo da águia em `src/components/Logo.astro` e em `public/favicon.svg` é um desenho provisório.
- **Logos de clientes** (`clients` em `site.ts`): a lista está vazia e a esteira roda com placeholders. Só incluir marcas com autorização.
- **Domínio**: preencher `site` em `astro.config.mjs` quando existir.

## Referência de design

O mockup aprovado é a prancha "Versão refinada — UX 2026" do canvas em `design/` (arquivos `.dc.html`, montados com a skill `design`). A implementação segue essa prancha; as outras duas pranchas são a versão anterior, mantidas para comparação.
