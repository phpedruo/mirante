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

    // Foto da fábrica: a entrada anima o invólucro e o parallax anima a foto
    // dentro dele, para as duas animações não disputarem a mesma propriedade.
    gsap.utils.toArray<HTMLElement>('[data-anim="media"]').forEach((wrapper) => {
      gsap.fromTo(
        wrapper,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: wrapper, start: 'top 88%', once: true },
        },
      );

      const inner = wrapper.firstElementChild;
      if (inner) {
        gsap.fromTo(
          inner,
          { yPercent: 4 },
          {
            yPercent: -4,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    });

    setupMarquees();
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
