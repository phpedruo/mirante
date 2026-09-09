import type { APIRoute } from 'astro';
import { launch } from '../data/site';

/**
 * Gerado a partir de `launch.isLive` (src/data/site.ts), pelo mesmo motivo do
 * `<meta name="robots">` em Base.astro: bloquear os buscadores enquanto o
 * site ainda é uma versão de teste.
 */
export const GET: APIRoute = ({ site }) => {
  const lines = launch.isLive
    ? [
        'User-agent: *',
        'Allow: /',
        ...(site ? [`Sitemap: ${new URL('sitemap-index.xml', site)}`] : []),
      ]
    : ['User-agent: *', 'Disallow: /'];

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
