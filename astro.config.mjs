import { defineConfig } from 'astro/config';

export default defineConfig({
  // Preencha quando o domínio estiver definido — usado para URLs absolutas e sitemap.
  // site: 'https://www.mirantecamisasefardamentos.com.br',
  build: {
    inlineStylesheets: 'always',
  },
});
