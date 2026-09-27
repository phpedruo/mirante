/**
 * Ponto único de configuração do site.
 *
 * Os campos marcados com PREENCHER são os dados que ainda não temos.
 * Trocar o valor aqui atualiza a página inteira — não é preciso mexer nos componentes.
 */

export const brand = {
  name: 'Mirante Camisas e Fardamentos',
  shortName: 'Mirante',
  slogan: 'Chama que a Mirante faz!',
  instagram: '@mirantecamisasefardamentos',
  instagramUrl: 'https://www.instagram.com/mirantecamisasefardamentos',
};

/**
 * Arquivos de arte que ficam em `public/`.
 *
 * Enquanto o caminho estiver vazio, o componente cai no que já existe hoje
 * (o placeholder hachurado, a moldura tracejada do mascote) em vez de apontar
 * para um arquivo que não existe.
 *
 * A logo não entra aqui: ela já chegou e mora em `Logo.astro`, que serve
 * `/logo-mirante.svg` e a versão para fundo escuro.
 */
export const assets = {
  /**
   * A águia da marca, usada na fala e no card de contato.
   *
   * É um render com fundo transparente, servido em 420px de largura — o dobro
   * dos 210px em que ela aparece maior na página, para não serrilhar em tela
   * retina. O arquivo original, maior, fica em `design/mascote-original/`,
   * fora de `public/`, para o dia em que ela precisar aparecer em outro
   * tamanho. Caminho vazio faz os dois lugares caírem na moldura tracejada.
   */
  mascot: '/mascote-mirante.webp',
  /**
   * A fachada do galpão, no topo do card de endereço: é o que o visitante
   * procura com os olhos quando chega na rua. O original tem só 680px de
   * largura, por isso a foto aparece no card, e não no espaço largo do mapa.
   * O arquivo original fica em `design/fachada-original/`. Vazio omite a foto.
   */
  facade: '/fachada-mirante.webp',
};

/**
 * O outdoor do hero: o que passa no quadro ao lado do texto.
 *
 * Lista vazia mostra o placeholder hachurado; com uma só imagem o quadro fica
 * parado; a passagem começa a partir de duas.
 *
 * São dois tipos de conteúdo, e a diferença não é enfeite: uma **foto**
 * preenche o quadro e aceita perder as bordas no corte, que é o que foto de
 * gente fardada pede — o assunto está no meio e sobra margem. Uma **arte** de
 * divulgação, não: ali o texto encosta na borda, e qualquer corte come
 * palavra. Por isso a arte aparece inteira, centrada sobre o azul da marca,
 * com as sobras laterais viradas parte do desenho em vez de acidente.
 *
 * O `promo` é o espaço da fábrica para anunciar o que quiser sobre a imagem —
 * uma campanha, uma linha nova, um recado de temporada. Vale nos dois tipos,
 * mas numa arte de Instagram costuma sobrar, porque a peça já traz o recado
 * dentro dela. Sem `promo`, a imagem aparece limpa.
 *
 * Os três de hoje não repetem o mesmo elogio: cada um pega um ponto diferente
 * — a técnica, a matéria-prima e o atendimento —, os dois primeiros vindos dos
 * mesmos `factoryPoints` que a seção de tecidos lista e o terceiro, do fluxo
 * consultivo da casa, em que um consultor acompanha o pedido do começo ao fim. Passando as três, o visitante recebe três argumentos em vez de três
 * fotos. Valem as regras de copy da página: uma linha por recado, nada de
 * preço e nada de comparação com concorrente.
 */
export type HeroSlide = {
  src: string;
  alt: string;
  /** Ausente vale 'foto'. */
  kind?: 'foto' | 'arte';
  promo?: { badge?: string; title: string; text?: string };
};

/**
 * As três de hoje são as peças que sobraram da seleção de "Atendemos todos os
 * públicos": recorte 1,25:1 do original em `design/produtos-originais/`, na
 * proporção do quadro, com a peça no centro. Refazer um corte é recortar do
 * original, nunca do `.webp`.
 *
 * AINDA FALTA o que o hero pede de verdade: foto de gente fardada — equipe na
 * recepção, turma de escola, operação em campo. As três de hoje são peças
 * soltas, sem contexto de uso, e seguram o lugar até as reais chegarem. A arte
 * do avental Pitú, que seria o primeiro `kind: 'arte'` da lista, ficou de fora
 * porque o arquivo tem 399px de largura e o quadro pede uns 650.
 */
export const heroSlides: HeroSlide[] = [
  {
    src: '/hero/polo-bordada.webp',
    alt: 'Camisa polo com logo bordado no peito',
    promo: { badge: 'Bordado próprio', title: 'A sua logo na peça' },
  },
  {
    src: '/hero/bata.webp',
    alt: 'Bata azul-marinho de manga curta',
    promo: { badge: 'Tecido escolhido', title: 'A malha que o uso pede' },
  },
  {
    src: '/hero/camisa-social.webp',
    alt: 'Camisa social escura de manga longa',
    promo: { badge: 'Contato próximo', title: 'Um consultor do pedido à entrega' },
  },
];

/**
 * A faixa logo abaixo do hero. Os dígitos de `number` sobem girando quando a
 * página abre; `suffix` fica parado ao lado, e um item sem `number` é só texto.
 *
 * Os três são números por uma razão de leitura: o item sem `number` fica sem
 * o dígito grande que os outros têm, e a linha inteira desanda — ele lê como
 * sobra, não como terceiro dado. Item só de texto continua funcionando, mas
 * não misturado com numerados.
 *
 * CONFERIR COM A FÁBRICA: os três vieram do cliente ou da descrição do
 * negócio e nenhum foi checado contra o registro da empresa. O de produção
 * própria é o que mais pede confirmação: se alguma etapa (bordado, por
 * exemplo) sai para fora, os 100% não se sustentam.
 */
export type HeroStat = { number?: string; suffix?: string; text: string };

export const heroStats: HeroStat[] = [
  { number: '10', suffix: '+', text: 'anos de história' },
  { number: '1000', suffix: '+', text: 'clientes atendidos' },
  { number: '100', suffix: '%', text: 'produção própria' },
];

export const contact = {
  whatsappDisplay: '(81) 9.8104-0516',
  /** Só dígitos, com código do país. Para montar links, prefira `whatsappUrl()`. */
  whatsappDigits: '5581981040516',
  /** PREENCHER: e-mail comercial que vai receber os formulários. */
  email: '',

  /**
   * Link de conversa já com a mensagem preenchida.
   *
   * Quem chega com contexto poupa uma rodada de "oi, do que você precisa?" —
   * por isso a mensagem é o padrão, e não um extra que cada chamador precisa
   * lembrar de passar. Passe um texto próprio quando o ponto de partida da
   * conversa for mais específico do que o padrão.
   */
  whatsappUrl(message = 'Olá! Vim pelo site e gostaria de um orçamento.') {
    return `https://wa.me/${this.whatsappDigits}?text=${encodeURIComponent(message)}`;
  },
};

export const address = {
  street: 'Av. Antônio Cabral de Souza, 2806',
  district: 'Maranguape II',
  city: 'Paulista',
  state: 'PE',
  zip: '53409-420',
  /** O pino do Google Business Profile, para os dados estruturados. */
  geo: { latitude: -7.932785, longitude: -34.861176 },
  /** Link de compartilhamento do perfil no Google Maps. */
  mapsProfileUrl: 'https://share.google/yuhiuG1K2MRjVFtV5',
  get full() {
    return `${this.street} — ${this.district}, ${this.city} – ${this.state}, ${this.zip}`;
  },
  /**
   * Busca do mapa e da rota. Leva o nome da empresa na frente do endereço
   * para o Google abrir no perfil da Mirante — com nome, fotos e avaliações —
   * em vez de um alfinete genérico na rua.
   */
  get mapsQuery() {
    return encodeURIComponent(
      `${brand.name}, ${this.street}, ${this.district}, ${this.city} - ${this.state}, ${this.zip}`,
    );
  },
};

export const company = {
  /**
   * Horário de funcionamento, como aparece na página. Precisa bater com o
   * Google Business Profile: horário divergente entre os dois é sinal de
   * informação desatualizada para o buscador.
   */
  openingHours: 'Segunda a sexta, das 8h às 17h',
  /** O mesmo horário, no formato que os buscadores leem. Mudar um exige mudar o outro. */
  openingHoursSpec: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:00',
  },
  /**
   * Razão social, para a linha de direitos reservados do rodapé, a política
   * de privacidade e os dados estruturados. Vazio usa o nome da marca.
   */
  legalName: 'Mirante Comercio Varejista de Fardamentos e Camisas LTDA',
  /** CNPJ para o rodapé e os dados estruturados. Vazio omite a menção. */
  cnpj: '33.765.038/0001-04',
  /** Pedido mínimo. Aparece só na resposta do FAQ, não se repete pela página. */
  minimumOrder: 30,
};

/**
 * PREENCHER: chave de acesso do Web3Forms (https://web3forms.com — gratuito).
 * Gere a chave usando o e-mail comercial acima; é ela que faz o formulário
 * chegar na caixa de entrada. Enquanto estiver vazia, o formulário avisa
 * o visitante que o envio está indisponível em vez de falhar em silêncio.
 */
export const formAccessKey = '';

/**
 * Como a arte vai para a peça. Cada palavra ganha, na página, uma animação
 * própria que imita o gesto da técnica — a coreografia mora em
 * `src/scripts/animations.ts` e se liga a este item pela `key`.
 *
 * A fábrica também faz aplique, mas o cliente pediu para a seção mostrar
 * apenas estas três.
 */
export type Technique = {
  /** Liga o card à sua animação. Trocar aqui exige trocar em animations.ts. */
  key: 'bordado' | 'serigrafia' | 'sublimacao';
  name: string;
};

export const techniques: Technique[] = [
  {
    key: 'bordado',
    name: 'Bordado',
  },
  {
    key: 'serigrafia',
    name: 'Serigrafia',
  },
  {
    key: 'sublimacao',
    name: 'Sublimação',
  },
];

/**
 * Tecidos e malhas que a fábrica trabalha — a matéria da seção de produtos.
 *
 * CONFERIR COM A FÁBRICA: esta lista é uma proposta baseada no que uma
 * confecção de fardamento costuma trabalhar. Antes do lançamento, confirmar
 * com a Mirante quais tecidos ela realmente usa e como prefere chamá-los.
 */
export type Fabric = {
  name: string;
  use: string;
  /** Caminho da foto do tecido quando existir. Vazio mostra o placeholder hachurado. */
  photo?: string;
};

/**
 * O padrão da matéria-prima, em uma linha só, logo abaixo da abertura da
 * seção de tecidos.
 *
 * É uma linha, e não um parágrafo, de propósito: um bloco de texto ali vira
 * caixa de dica, que o visitante pula. A regra de copy da marca também vale —
 * o argumento é a qualidade do que entra no galpão, nunca a comparação com
 * quem quer que seja.
 */
export const fabricsNote =
  'Trabalhamos com as melhores marcas de malha e tecido do mercado.';

/**
 * O card que fecha a grade de tecidos. A lista acima não é tudo o que a
 * fábrica trabalha, e sem ele o visitante lê os sete como catálogo fechado.
 * Não cita tecido nenhum de propósito: a lista ainda está por confirmar, e
 * este card não pode prometer malha que a fábrica não tenha.
 */
export const fabricsMore = {
  name: 'E muito mais',
  use: 'Uma grande variedade de malhas e tecidos para o que a sua peça pedir.',
};

export const fabrics: Fabric[] = [
  {
    name: 'Malha PV e algodão',
    use: 'Camiseta promocional, de evento e de campanha.',
    photo: '/malhas/algodao.webp',
  },
  {
    name: 'Piquet',
    use: 'Camisa polo, com gola que aguenta lavagem.',
    photo: '/malhas/piquet.webp',
  },
  {
    name: 'Dry fit e helanca',
    use: 'Corrida, jogo interno e ballet, leve e respirável.',
    photo: '/malhas/dry-fit.webp',
  },
  {
    name: 'Brim e sarja',
    use: 'Fardamento pesado, macacão e avental.',
    photo: '/malhas/brim.webp',
  },
  {
    name: 'Oxford e tricoline',
    use: 'Camisa social, bata e recepção.',
    photo: '/malhas/oxford.webp',
  },
  {
    name: 'Microfibra e gabardine',
    use: 'Jaleco e bata de clínica, que não amassam.',
    photo: '/malhas/gabardine.webp',
  },
  {
    name: 'Malha com proteção UV',
    use: 'Manga longa para quem trabalha no sol.',
    photo: '/malhas/uv.webp',
  },
];

/**
 * As linhas de produto, agrupadas por categoria de fardamento — é assim que
 * elas aparecem nos cards da esteira. A contagem desta lista também alimenta
 * um dos números da faixa de destaques.
 */
export type ProductCategory = {
  name: string;
  description: string;
  /** Caminho da foto quando existir. Vazio mostra o placeholder hachurado. */
  photo?: string;
};

export const productCategories: ProductCategory[] = [
  {
    name: 'Fardamento escolar',
    description: 'Camisa, calça, vestido, short e short-saia, do infantil ao adulto.',
    photo: '/produtos/escolar.webp',
  },
  {
    name: 'Fardamento empresarial',
    description: 'Polo bordada, camisa social e colete, para equipe e recepção.',
    photo: '/produtos/empresarial.webp',
  },
  {
    name: 'Fardamento operacional',
    description: 'Macacão e conjunto pesado, com ou sem faixa refletiva.',
    photo: '/produtos/industrial.webp',
  },
  {
    name: 'Saúde e laboratório',
    description: 'Bata, jaleco e scrub, com ou sem bordado.',
    photo: '/produtos/saude.webp',
  },
  {
    name: 'Alimentação',
    description: 'Avental e camisa de cozinha, para restaurante e bar.',
    photo: '/produtos/alimentacao.webp',
  },
  {
    name: 'Esporte e eventos',
    description: 'Jogos internos, corrida, ballet e camisa de campanha.',
    photo: '/produtos/esporte.webp',
  },
  {
    name: 'Trabalho no sol',
    description: 'Camisa UV manga longa, com proteção para o dia inteiro.',
    photo: '/produtos/uv.webp',
  },
  {
    name: 'Brindes e bandeiras',
    description: 'Sacola, boné, ecobag, viseira, sacochila e bandeira.',
    photo: '/produtos/brindes.webp',
  },
];

/** Faixas de quantidade do formulário. A primeira começa no pedido mínimo. */
export const quantities = [
  `${company.minimumOrder} a 50 peças`,
  '50 a 100 peças',
  '100 a 500 peças',
  'Mais de 500 peças',
];

/**
 * Logos de clientes. Adicione { name, logo } quando tiver autorização e o arquivo
 * em vetor. Enquanto a lista estiver vazia, a seção mostra placeholders.
 */
export type Client = { name: string; logo: string };
export const clients: Client[] = [
  { name: 'Afya', logo: '/clientes/afya.webp' },
  { name: 'Colégio Patrícia Costa', logo: '/clientes/colegio-patricia-costa.webp' },
  { name: 'Colégio Santa Emília', logo: '/clientes/colegio-santa-emilia.webp' },
  { name: 'Mix Mateus', logo: '/clientes/mix-mateus.webp' },
  { name: 'Natto', logo: '/clientes/natto.webp' },
  { name: 'Novo Atacarejo', logo: '/clientes/novo-atacarejo.webp' },
  { name: 'Passaporte', logo: '/clientes/passaporte.svg' },
  { name: 'Pitú', logo: '/clientes/pitu.webp' },
  { name: 'Solar Coca-Cola', logo: '/clientes/solar-coca-cola.webp' },
  { name: 'UNINASSAU', logo: '/clientes/uninassau.webp' },
];

/** Pontos de qualidade da fábrica. Aparecem ao lado dos tecidos, na seção de produtos. */
export const factoryPoints = [
  'Tecido escolhido conforme o uso da peça',
  'Costura e acabamento conferidos peça por peça',
  'Prévia da peça aprovada por você antes de produzir',
  'Pontualidade e compromisso na entrega',
];

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: 'Qual é a quantidade mínima?',
    answer: `${company.minimumOrder} peças por pedido.`,
  },
  {
    question: 'O que eu preciso enviar?',
    answer:
      'O seu logo e as referências do que você imagina. A partir delas, fazemos o orçamento e a prévia da peça para você aprovar antes da produção.',
  },
  {
    question: 'Qual o prazo de produção?',
    // PREENCHER: prazo médio por faixa de quantidade.
    answer: 'O prazo é confirmado junto com o orçamento, de acordo com a quantidade e o tipo de peça.',
  },
  {
    question: 'Dá para misturar tamanhos no mesmo pedido?',
    answer: 'Dá. A grade de tamanhos é fechada junto com a aprovação da prévia.',
  },
  {
    question: 'Vocês entregam fora de Paulista?',
    // PREENCHER: até onde a van atende e como funciona fora dessa área.
    answer: 'A entrega sai no nosso próprio veículo. Confirme a região com a nossa equipe pelo WhatsApp.',
  },
  {
    question: 'Como funciona o pagamento?',
    // PREENCHER: entrada, parcelamento, faturamento para empresa, emissão de nota.
    answer: 'As condições são combinadas na proposta, junto com o orçamento.',
  },
];

/**
 * Política de privacidade (LGPD), num diálogo compacto em
 * `PrivacyDialog.astro`, aberto pelo link abaixo do formulário e pelo rodapé.
 *
 * O texto descreve o que o site faz *hoje*: o formulário via Web3Forms, o
 * mapa do Google, os links para WhatsApp e Instagram e nenhum cookie de
 * análise ou publicidade. Qualquer terceiro novo — analytics, pixel, chat —
 * ou campo novo no formulário exige atualizar o texto e a data abaixo.
 */
export const privacy = {
  /** Id do <dialog>; os botões que abrem a política apontam para ele. */
  dialogId: 'politica-privacidade',
  /** Data da última revisão do texto, como aparece no diálogo. */
  updatedAt: '26 de setembro de 2026',
};

/**
 * Controla se o site já está no ar para os buscadores.
 *
 * Enquanto `isLive` for `false`, toda página sai com `noindex, nofollow` e o
 * `robots.txt` bloqueia os robôs — assim uma URL de teste (domínio provisório,
 * preview de hospedagem) não corre o risco de ser indexada antes da hora, o
 * que criaria conteúdo duplicado quando o domínio final entrar no ar.
 *
 * No dia do lançamento: mude para `true`, preencha `site` em
 * `astro.config.mjs` e descomente a integração do sitemap nesse arquivo.
 */
export const launch = {
  isLive: false,
};

export const seo = {
  title: 'Mirante Camisas e Fardamentos | Fábrica de uniformes em Paulista – PE',
  description:
    'Fábrica de fardamento escolar e industrial, camisas polo, promocionais, batas, aventais e brindes em Paulista – PE. Produção própria, do corte à entrega.',
  /**
   * PREENCHER: caminho de uma imagem 1200×630 (JPG ou PNG) em `public/`, usada
   * quando o link do site é compartilhado no WhatsApp, Instagram etc. Vazio
   * omite a tag em vez de apontar para um arquivo que não existe.
   */
  ogImage: '',
};
