import { defineConfig } from 'astro/config';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Preencha quando o domínio estiver definido — necessário para o link
  // canônico, o Open Graph e o sitemap abaixo funcionarem corretamente.
  // site: 'https://www.mirantecamisasefardamentos.com.br',

  // Descomente junto com `site` acima e com o import no topo do arquivo.
  // Gera /sitemap-index.xml automaticamente a cada build.
  // integrations: [sitemap()],

  build: {
    inlineStylesheets: 'always',
  },
});
