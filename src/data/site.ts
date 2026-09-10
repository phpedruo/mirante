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
  /** PREENCHER: SVG do mascote águia. Usado na fala e no card de contato. */
  mascot: '',
};

/**
 * O outdoor do hero: as artes e fotos que passam no quadro ao lado do texto.
 *
 * Lista vazia mostra o placeholder hachurado; com uma só imagem o quadro fica
 * parado; a passagem começa a partir de duas.
 *
 * PREENCHER: arquivos em `public/hero/`. Servem fotos de pessoas fardadas, de
 * peças prontas e as artes do Instagram. O quadro é um pouco mais largo que
 * alto e a imagem é cortada para preenchê-lo, então o assunto precisa estar
 * no centro — arte com texto colado na borda perde pedaço.
 *
 * Os três itens abaixo são placeholders de exemplo, só para ver a passagem
 * funcionando — trocar pelos arquivos reais e apagar os de exemplo antes do
 * lançamento (`public/hero/exemplo-*.svg`).
 */
export type HeroSlide = { src: string; alt: string };

export const heroSlides: HeroSlide[] = [
  { src: '/hero/exemplo-1-fardamento-empresarial.svg', alt: 'Exemplo: fardamento empresarial' },
  { src: '/hero/exemplo-2-fardamento-industrial.svg', alt: 'Exemplo: fardamento industrial' },
  { src: '/hero/exemplo-3-camisa-polo.svg', alt: 'Exemplo: camisa polo bordada' },
];

/**
 * A faixa logo abaixo do hero. Os dígitos de `number` sobem girando quando a
 * página abre; `suffix` fica parado ao lado, e um item sem `number` é só texto.
 *
 * CONFERIR COM A FÁBRICA: os dois números vieram do cliente e nunca foram
 * checados contra o registro da empresa. "Entrega grátis" também precisa de
 * confirmação — hoje o FAQ diz que a região de entrega é combinada no WhatsApp,
 * então uma promessa sem condição aqui pode virar cobrança lá na frente.
 */
export type HeroStat = { number?: string; suffix?: string; text: string };

export const heroStats: HeroStat[] = [
  { number: '10', suffix: '+', text: 'anos de mercado' },
  { number: '1000', suffix: '+', text: 'clientes atendidos' },
  { text: 'Entrega grátis' },
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
  get full() {
    return `${this.street} — ${this.district}, ${this.city} – ${this.state}, ${this.zip}`;
  },
  get mapsQuery() {
    return encodeURIComponent(
      `${this.street}, ${this.district}, ${this.city} - ${this.state}, ${this.zip}`,
    );
  },
};

export const company = {
  /** PREENCHER: horário de funcionamento. Ex.: 'Segunda a sexta, 8h às 17h'. */
  openingHours: '',
  /**
   * PREENCHER: razão social, para a linha de direitos reservados do rodapé.
   * Ex.: 'Mirante Confecções LTDA'. Vazio usa o nome da marca no lugar.
   */
  legalName: '',
  /** PREENCHER: CNPJ para o rodapé. Ex.: '00.000.000/0001-00'. Vazio omite a menção. */
  cnpj: '',
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
  caption: string;
};

export const techniques: Technique[] = [
  {
    key: 'bordado',
    name: 'Bordado',
    caption: 'Linha aplicada no tecido, com relevo que aguenta a lavagem.',
  },
  {
    key: 'serigrafia',
    name: 'Serigrafia',
    caption: 'Tinta puxada no rodo sobre a tela: cor firme, peça a peça.',
  },
  {
    key: 'sublimacao',
    name: 'Sublimação',
    caption: 'O calor leva a arte para dentro da malha, sem limite de cor.',
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

export const fabrics: Fabric[] = [
  { name: 'Malha PV e algodão', use: 'Camiseta promocional, de evento e de campanha.' },
  { name: 'Piquet', use: 'Camisa polo, com gola que aguenta lavagem.' },
  { name: 'Dry fit e helanca', use: 'Corrida, jogo interno e ballet — leve e respirável.' },
  { name: 'Brim e sarja', use: 'Fardamento pesado, macacão e avental.' },
  { name: 'Oxford e tricoline', use: 'Camisa social, bata e recepção.' },
  { name: 'Microfibra e gabardine', use: 'Jaleco e bata de clínica, que não amassam.' },
  { name: 'Malha com proteção UV', use: 'Manga longa para quem trabalha no sol.' },
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
    description: 'Vestido, camisa, short e short-saia, do infantil ao adulto.',
  },
  {
    name: 'Fardamento empresarial',
    description: 'Polo bordada, camisa social e colete, para equipe e recepção.',
  },
  {
    name: 'Fardamento industrial',
    description: 'Macacão e conjunto pesado, com faixa refletiva.',
  },
  {
    name: 'Saúde e laboratório',
    description: 'Bata, jaleco e scrub, com bordado no bolso.',
  },
  {
    name: 'Alimentação',
    description: 'Avental, dolmã e camisa de cozinha, para restaurante e bar.',
  },
  {
    name: 'Esporte e eventos',
    description: 'Jogo interno, corrida, ballet e camisa de campanha.',
  },
  {
    name: 'Trabalho no sol',
    description: 'Camisa UV manga longa, com proteção para o dia inteiro.',
  },
  {
    name: 'Brindes e bandeiras',
    description: 'Sacola, boné, viseira, mochila saco e bandeira.',
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
export const clients: Client[] = [];

/** Pontos de qualidade da fábrica. Aparecem ao lado dos tecidos, na seção de produtos. */
export const factoryPoints = [
  'Tecido escolhido conforme o uso da peça',
  'Costura e acabamento conferidos peça por peça',
  'Arte aprovada por você antes de produzir',
  'Pontualidade e compromisso na entrega',
];

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: 'Qual é a quantidade mínima?',
    answer: `${company.minimumOrder} peças por pedido.`,
  },
  {
    question: 'Preciso mandar a arte pronta?',
    answer:
      'Não. Se você já tem o logo, a gente aplica; se não tem arte fechada, montamos a proposta visual da peça para você aprovar antes da produção.',
  },
  {
    question: 'Qual o prazo de produção?',
    // PREENCHER: prazo médio por faixa de quantidade.
    answer: 'O prazo é confirmado junto com o orçamento, de acordo com a quantidade e o tipo de peça.',
  },
  {
    question: 'Dá para misturar tamanhos no mesmo pedido?',
    answer: 'Dá. A grade de tamanhos é fechada junto com a aprovação da arte.',
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
