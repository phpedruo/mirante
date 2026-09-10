import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ *
 * FAQ
 * O accordion precisa funcionar mesmo com "reduzir movimento" ligado,
 * então ele fica fora do matchMedia — só a duração muda.
 * ------------------------------------------------------------------ */
function setupFaq() {
  const list = document.querySelector<HTMLElement>('[data-faq]');
  if (!list) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = prefersReduced ? 0 : 0.32;
  const triggers = Array.from(list.querySelectorAll<HTMLButtonElement>('[data-faq-trigger]'));

  const panelOf = (trigger: HTMLButtonElement) => {
    const id = trigger.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
  };

  const setState = (trigger: HTMLButtonElement, open: boolean, animate: boolean) => {
    const panel = panelOf(trigger);
    if (!panel) return;

    trigger.setAttribute('aria-expanded', String(open));
    gsap.to(panel, {
      height: open ? 'auto' : 0,
      duration: animate ? duration : 0,
      ease: 'power2.out',
      onComplete: () => ScrollTrigger.refresh(),
    });

    const bar = trigger.querySelector('.faq__icon-bar');
    if (bar) {
      gsap.to(bar, {
        rotate: open ? 90 : 0,
        opacity: open ? 0 : 1,
        duration: animate ? duration : 0,
        ease: 'power2.out',
        transformOrigin: 'center',
      });
    }
  };

  // Estado inicial: a primeira pergunta aberta, o resto fechado, sem animar.
  triggers.forEach((trigger, index) => setState(trigger, index === 0, false));

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      // Só uma resposta aberta por vez, como no mockup.
      triggers.forEach((other) => {
        if (other !== trigger) setState(other, false, true);
      });
      setState(trigger, !isOpen, true);
    });
  });
}

/* ------------------------------------------------------------------ *
 * Esteiras da vitrine e dos logos
 * ------------------------------------------------------------------ */
function setupMarquees() {
  const marquees = Array.from(document.querySelectorAll<HTMLElement>('[data-marquee]'));
  if (marquees.length === 0) return;

  const loops = marquees.map((marquee) => {
    const track = marquee.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return null;

    const toLeft = marquee.dataset.marquee !== 'ltr';
    // A lista é duplicada no HTML, então -50% devolve o trilho ao ponto de partida.
    const seconds = toLeft ? 34 : 72;

    const tween = gsap.fromTo(
      track,
      { xPercent: toLeft ? 0 : -50 },
      {
        xPercent: toLeft ? -50 : 0,
        duration: seconds,
        ease: 'none',
        repeat: -1,
      },
    );

    marquee.addEventListener('pointerenter', () => gsap.to(tween, { timeScale: 0, duration: 0.4 }));
    marquee.addEventListener('pointerleave', () => gsap.to(tween, { timeScale: 1, duration: 0.4 }));

    return tween;
  });

  // O scroll acelera as esteiras de leve, sem mudar o sentido.
  let resetSpeed: number | undefined;
  ScrollTrigger.create({
    onUpdate: (self) => {
      const boost = Math.min(Math.abs(self.getVelocity()) / 1400, 2.4);
      loops.forEach((tween) => tween && gsap.set(tween, { timeScale: 1 + boost }));

      window.clearTimeout(resetSpeed);
      resetSpeed = window.setTimeout(() => {
        loops.forEach((tween) => tween && gsap.to(tween, { timeScale: 1, duration: 0.6 }));
      }, 180);
    },
  });
}

/* ------------------------------------------------------------------ *
 * Técnicas: bordado, serigrafia e sublimação
 *
 * Cada palavra ganha o gesto da própria técnica quando entra na tela.
 * A cobertura (`data-tech-wipe`) e o conteúdo dentro dela
 * (`data-tech-wipe-inner`) andam sempre com a mesma duração e a mesma ease,
 * em sentidos opostos: é o que faz a palavra "por fazer" parecer parada
 * enquanto só a boca da cobertura avança. Ver Techniques.astro.
 * ------------------------------------------------------------------ */
function setupTechniques() {
  const cards = gsap.utils.toArray<HTMLElement>('[data-tech]');

  cards.forEach((card) => {
    const q = gsap.utils.selector(card);
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: card, start: 'top 80%', once: true },
    });

    if (card.dataset.tech === 'sublimacao') {
      // A chapa desce, cobre a palavra, e a troca acontece escondida embaixo
      // dela — igual à prensa de verdade.
      timeline
        .fromTo(
          q('[data-tech-press]'),
          { yPercent: -125 },
          { yPercent: 0, duration: 0.42, ease: 'power3.in' },
        )
        .set(q('[data-tech-ghost]'), { opacity: 0 })
        .set(q('.tech__word'), { opacity: 1 })
        .to(q('[data-tech-press]'), { yPercent: -125, duration: 0.5, ease: 'power2.out' }, '+=0.26')
        .fromTo(
          q('[data-tech-vapor]'),
          { y: 8, opacity: 0 },
          { y: -26, opacity: 0.85, duration: 0.55, ease: 'sine.out', stagger: 0.08 },
          '<0.1',
        )
        .to(q('[data-tech-vapor]'), { opacity: 0, duration: 0.4, ease: 'sine.in' }, '-=0.25');

      return;
    }

    const sweep = card.dataset.tech === 'bordado' ? 1.3 : 1.05;
    const ease = card.dataset.tech === 'bordado' ? 'none' : 'power1.inOut';
    const tool = q('[data-tech-tool]');

    timeline
      .fromTo(
        q('[data-tech-wipe], [data-tech-rail]'),
        { xPercent: 0 },
        { xPercent: 100, duration: sweep, ease },
        0.2,
      )
      .fromTo(
        q('[data-tech-wipe-inner]'),
        { xPercent: 0 },
        { xPercent: -100, duration: sweep, ease },
        0.2,
      )
      .fromTo(
        q('[data-tech-rail]'),
        { opacity: 0 },
        { opacity: 1, duration: 0.22, ease: 'power2.out' },
        0.1,
      )
      .to(q('[data-tech-rail]'), { opacity: 0, duration: 0.28, ease: 'power2.in' }, sweep + 0.05);

    if (card.dataset.tech === 'bordado') {
      // O sobe-e-desce da agulha, no ritmo do ponto.
      timeline.to(
        tool,
        {
          y: -10,
          duration: 0.13,
          ease: 'sine.inOut',
          repeat: Math.round(sweep / 0.13),
          yoyo: true,
        },
        0.2,
      );
    } else {
      // O rodo encosta antes de puxar a tinta.
      timeline.fromTo(
        tool,
        { yPercent: -22 },
        { yPercent: 0, duration: 0.24, ease: 'power2.out' },
        0.08,
      );
    }
  });
}

/* ------------------------------------------------------------------ *
 * Outdoor do hero
 * A arte da vez é puxada para fora enquanto a próxima entra no lugar,
 * as duas ao mesmo tempo — é isso que dá a sensação de troca de cartaz.
 * ------------------------------------------------------------------ */
function setupOutdoor() {
  const outdoor = document.querySelector<HTMLElement>('[data-outdoor]');
  if (!outdoor) return;

  const slides = gsap.utils.toArray<HTMLElement>('[data-outdoor-slide]', outdoor);
  // Com uma arte só não há troca: o quadro fica parado nela.
  if (slides.length < 2) return;

  // O CSS esconde as artes seguintes para o caso de não haver JS. Aqui elas
  // voltam a aparecer e passam a ser posicionadas pelo eixo X.
  gsap.set(slides, { opacity: 1, xPercent: 100 });
  gsap.set(slides[0], { xPercent: 0 });

  let current = 0;
  let hovering = false;
  let waiting: gsap.core.Tween | undefined;

  const advance = () => {
    const next = (current + 1) % slides.length;

    gsap
      .timeline({ defaults: { duration: 0.9, ease: 'power3.inOut' }, onComplete: wait })
      .to(slides[current], { xPercent: -100 }, 0)
      .fromTo(slides[next], { xPercent: 100 }, { xPercent: 0 }, 0);

    current = next;
  };

  function wait() {
    waiting = gsap.delayedCall(4.5, advance);
    // A espera nasce parada se o ponteiro já estava em cima quando a troca
    // anterior terminou; senão a arte escaparia justo de quem parou para ver.
    if (hovering) waiting.pause();
  }

  wait();

  outdoor.addEventListener('pointerenter', () => {
    hovering = true;
    waiting?.pause();
  });

  outdoor.addEventListener('pointerleave', () => {
    hovering = false;
    waiting?.resume();
  });
}

/* ------------------------------------------------------------------ *
 * Entradas
 * ------------------------------------------------------------------ */
function setupReveals() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Hero: entra assim que a página abre.
    const heroItems = gsap.utils.toArray<HTMLElement>('[data-anim="hero"]');
    const heroMedia = document.querySelector<HTMLElement>('[data-anim="hero-media"]');

    const intro = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.7 } });

    if (heroItems.length > 0) {
      intro.fromTo(heroItems, { opacity: 0, y: 22 }, { opacity: 1, y: 0, stagger: 0.08 });
    }

    if (heroMedia) {
      intro.fromTo(
        heroMedia,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.9 },
        0.15,
      );
    }

    // Os rolos dos números da faixa. Cada um parte do zero e sobe uma volta
    // inteira antes de parar no seu dígito, em sequência da esquerda para a
    // direita. O `y: 0` zera o translate que o CSS de repouso já tinha posto:
    // sem ele o GSAP somaria os dois e o número sairia do lugar.
    const reels = gsap.utils.toArray<HTMLElement>('[data-reel]');

    if (reels.length > 0) {
      intro.fromTo(
        reels,
        { yPercent: 0, y: 0 },
        {
          // Vinte casas no rolo: parar no dígito d é subir (10 + d) delas.
          yPercent: (_index: number, target: HTMLElement) =>
            -(Number(target.dataset.reel) + 10) * 5,
          duration: 1.05,
          ease: 'power3.out',
          stagger: 0.08,
        },
        0.4,
      );
    }

    // Demais elementos: sobem quando entram na tela.
    const groups: Array<{ selector: string; stagger: number }> = [
      { selector: '[data-anim="up"]', stagger: 0.08 },
      { selector: '[data-anim="fact"]', stagger: 0.09 },
      { selector: '[data-anim="point"]', stagger: 0.08 },
    ];

    groups.forEach(({ selector, stagger }) => {
      ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>(selector), {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger },
          ),
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-anim="scale"]').forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 85%', once: true },
        },
      );
    });

    setupTechniques();
    setupMarquees();
    setupOutdoor();
  });
}

function init() {
  setupFaq();
  setupReveals();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
