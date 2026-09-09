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

export const contact = {
  whatsappDisplay: '(81) 9.8104-0516',
  /** Só dígitos, com código do país — usado no link wa.me. */
  whatsappDigits: '5581981040516',
  /** PREENCHER: e-mail comercial que vai receber os formulários. */
  email: '',
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
  /** PREENCHER: anos de mercado. Ex.: '12'. Vazio esconde o número na faixa de destaques. */
  yearsInBusiness: '',
  /** PREENCHER: horário de funcionamento. Ex.: 'Segunda a sexta, 8h às 17h'. */
  openingHours: '',
  /** PREENCHER: CNPJ para o rodapé. */
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

export type Product = {
  name: string;
  description: string;
  /** Caminho da foto quando existir. Vazio mostra o placeholder hachurado. */
  photo?: string;
};

export const products: Product[] = [
  {
    name: 'Fardamento escolar',
    description: 'Vestido, camisa, short e short-saia, do infantil ao adulto.',
  },
  {
    name: 'Camisas polo',
    description: 'Gola trabalhada e logo bordado, para durar lavagem após lavagem.',
  },
  {
    name: 'Fardamento pesado',
    description: 'Macacão e conjunto industrial com faixa refletiva.',
  },
  {
    name: 'Batas e jalecos',
    description: 'Para clínica, consultório e laboratório, com bordado no bolso.',
  },
  {
    name: 'Aventais',
    description: 'Para restaurante, bar e food service, com a marca bem aplicada.',
  },
  {
    name: 'Camisas promocionais',
    description: 'Campanha, evento e ação de rua, com a arte que você aprovou.',
  },
  {
    name: 'Jogos internos e eventos',
    description: 'Camisa de time sublimada, com escudo, número e nome.',
  },
  {
    name: 'Camisas UV',
    description: 'Manga longa com proteção solar, para quem trabalha no sol.',
  },
  {
    name: 'Camisas para corrida',
    description: 'Tecido leve e respirável, com acabamento reforçado.',
  },
  {
    name: 'Roupas de ballet',
    description: 'Collant e saia personalizados para a escola de dança.',
  },
  {
    name: 'Brindes',
    description: 'Sacola, boné, viseira, almofada e mochila saco.',
  },
  {
    name: 'Bandeiras',
    description: 'Fachada, evento e institucional, com cor que aguenta o tempo.',
  },
];

/**
 * Logos de clientes. Adicione { name, logo } quando tiver autorização e o arquivo
 * em vetor. Enquanto a lista estiver vazia, a seção mostra placeholders.
 */
export type Client = { name: string; logo: string };
export const clients: Client[] = [];

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
