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

  // Content Security Policy. O Astro escreve uma <meta> em cada página com o
  // hash de cada script e de cada <style> que saiu do build, e o navegador
  // recusa o resto — é o que impede um script injetado de rodar.
  // Terceiro novo (analytics, chat, iframe, CDN) precisa ter a origem liberada
  // aqui, senão o navegador o bloqueia sem aviso na tela, só no console.
  // Não vale em `npm run dev`: confira com `build` + `preview`.
  // `frame-ancestors` não funciona em <meta> e por isso mora em public/_headers.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        // O envio do formulário vai direto para o Web3Forms; sem JavaScript, o
        // POST é do próprio <form>, e o Web3Forms responde redirecionando para
        // a página de sucesso dele.
        "connect-src 'self' https://api.web3forms.com",
        "form-action 'self' https://api.web3forms.com https://web3forms.com",
        // O mapa da seção de localização.
        "frame-src https://www.google.com",
        "base-uri 'self'",
        "object-src 'none'",
      ],
      styleDirective: {
        resources: [
          // Atributo `style` fica liberado: os rolos de dígitos do hero e as
          // amostras de tecido dependem dele, e o ScrollTrigger escreve um no
          // <body>. As tags <style> continuam presas aos hashes, com o 'self'
          // que o Astro já põe por padrão.
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },

  // O site não tem Markdown. Desligar o realce de código só tira o aviso de
  // CSP do build: o Shiki, que é o padrão, gera estilo inline.
  markdown: {
    syntaxHighlight: false,
  },
});
