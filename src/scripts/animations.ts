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

    if (!('marqueeDrag' in marquee.dataset)) {
      marquee.addEventListener('pointerenter', () => gsap.to(tween, { timeScale: 0, duration: 0.4 }));
      marquee.addEventListener('pointerleave', () => gsap.to(tween, { timeScale: 1, duration: 0.4 }));
      return tween;
    }

    /* --- Esteira que o visitante conduz -----------------------------
     * Aqui o gesto substitui a pausa no hover: arrastar move o trilho na
     * mesma medida do dedo e a esteira volta a andar quando ele sai.
     *
     * O gesto não move o trilho por fora do tween — move o progresso do
     * próprio tween, que é o que faz a esteira retomar exatamente de onde a
     * mão soltou, sem salto. A conversão é direta: a viagem inteira do tween
     * é meia volta do trilho (`half` px), logo cada pixel de dedo vale
     * `1 / half` de progresso. O sinal se inverte na esteira que corre para a
     * esquerda, porque lá o progresso cresce enquanto o trilho anda para trás.
     * ---------------------------------------------------------------- */
    const wrap = gsap.utils.wrap(0, 1);
    const progressPerPixel = (px: number) => {
      const half = track.offsetWidth / 2;
      return half === 0 ? 0 : (px / half) * (toLeft ? -1 : 1);
    };

    // Um passo do botão é um card inteiro, gap incluído.
    const stepDistance = () => {
      const card = track.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.offsetWidth + gap : 240;
    };

    const resume = () => {
      gsap.killTweensOf(tween);
      tween.play();
      gsap.to(tween, { timeScale: 1, duration: 0.4 });
    };

    let pointer = -1;
    let lastX = 0;

    marquee.addEventListener('pointerdown', (event) => {
      if (pointer !== -1 || event.button !== 0) return;
      if ((event.target as HTMLElement).closest('[data-marquee-step]')) return;
      pointer = event.pointerId;
      lastX = event.clientX;
      marquee.setPointerCapture(pointer);
      marquee.classList.add('is-dragging');
      gsap.killTweensOf(tween);
      tween.pause();
    });

    marquee.addEventListener('pointermove', (event) => {
      if (event.pointerId !== pointer) return;
      tween.progress(wrap(tween.progress() + progressPerPixel(event.clientX - lastX)));
      lastX = event.clientX;
    });

    const release = (event: PointerEvent) => {
      if (event.pointerId !== pointer) return;
      marquee.releasePointerCapture(pointer);
      pointer = -1;
      marquee.classList.remove('is-dragging');
      resume();
    };

    marquee.addEventListener('pointerup', release);
    marquee.addEventListener('pointercancel', release);

    // No desktop, os dois botões dão o mesmo empurrão sem precisar arrastar:
    // um card por clique, deslizando até lá antes de devolver a esteira ao laço.
    marquee.querySelectorAll<HTMLElement>('[data-marquee-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const direction = button.dataset.marqueeStep === 'prev' ? 1 : -1;
        const target = { p: tween.progress() };
        gsap.killTweensOf(tween);
        gsap.killTweensOf(target);
        tween.pause();
        gsap.to(target, {
          p: target.p + progressPerPixel(direction * stepDistance()),
          duration: 0.55,
          ease: 'power2.out',
          onUpdate: () => tween.progress(wrap(target.p)),
          onComplete: resume,
        });
      });
    });

    return tween;
  });

  // O scroll acelera as esteiras de leve, sem mudar o sentido. A esteira que o
  // visitante estiver conduzindo fica de fora: ela está pausada, e mexer no
  // timeScale dela só atrapalharia a retomada.
  let resetSpeed: number | undefined;
  ScrollTrigger.create({
    onUpdate: (self) => {
      const boost = Math.min(Math.abs(self.getVelocity()) / 1400, 2.4);
      loops.forEach((tween) => tween && !tween.paused() && gsap.set(tween, { timeScale: 1 + boost }));

      window.clearTimeout(resetSpeed);
      resetSpeed = window.setTimeout(() => {
        loops.forEach((tween) => tween && !tween.paused() && gsap.to(tween, { timeScale: 1, duration: 0.6 }));
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

  // No desktop a abertura vai para a coluna da direita, centrada, enquanto a
  // lista das três — bem mais alta — sobe acima dela. Quem rola encontra
  // "Bordado" antes da pergunta que a seção faz, e o gesto se gasta numa
  // palavra que ainda não tem contexto. Por isso cada palavra espera duas
  // coisas: entrar na tela e a abertura já ter entrado. O que vier por
  // último é que dispara. Abaixo de 1080px a abertura vem antes no fluxo,
  // então a espera já está cumprida quando a palavra chega.
  const intro = document.querySelector<HTMLElement>('[data-tech-intro]');
  const waiting: Array<() => void> = [];
  let introSeen = !intro;

  if (intro) {
    ScrollTrigger.create({
      trigger: intro,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        introSeen = true;
        waiting.splice(0).forEach((play) => play());
      },
    });
  }

  cards.forEach((card) => {
    const q = gsap.utils.selector(card);
    const timeline = gsap.timeline({ paused: true });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const play = () => timeline.play();
        if (introSeen) play();
        else waiting.push(play);
      },
    });

    // Bordado e sublimação são máquina, e andam em ritmo constante; o rodo da
    // serigrafia é mão humana, e por isso acelera e desacelera.
    const isBordado = card.dataset.tech === 'bordado';
    const isSublimacao = card.dataset.tech === 'sublimacao';
    const sweep = isBordado ? 1.3 : isSublimacao ? 1.15 : 1.05;
    const ease = card.dataset.tech === 'serigrafia' ? 'power1.inOut' : 'none';
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

    if (isBordado) {
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
    } else if (isSublimacao) {
      // O vapor sobe do rastro do cilindro: cada baforada sai no instante em
      // que ele passa por cima dela. Como a passagem é de ritmo constante, a
      // conta é direta — as três estão em 16%, 48% e 76% do palco, e a
      // primeira sai quando o cilindro chega lá.
      const vapor = q('[data-tech-vapor]');
      const firstPuff = 0.2 + 0.16 * sweep;
      const betweenPuffs = 0.3 * sweep;

      timeline
        .fromTo(
          vapor,
          { y: 8, opacity: 0 },
          { y: -26, opacity: 0.85, duration: 0.5, ease: 'sine.out', stagger: betweenPuffs },
          firstPuff,
        )
        .to(
          vapor,
          { opacity: 0, duration: 0.42, ease: 'sine.in', stagger: betweenPuffs },
          firstPuff + 0.5,
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
 * Fundo do hero
 * A imagem da vez é puxada para fora enquanto a próxima entra no lugar,
 * as duas ao mesmo tempo — é isso que dá a sensação de troca de cartaz.
 * O pop-up do recado fica parado na legenda; o que troca é o texto dele,
 * apagado e reescrito como quem digita.
 * ------------------------------------------------------------------ */
type Promo = { title: string; text: string } | null;

/** Segundos por letra: apagar é mais rápido que escrever, como no teclado. */
const ERASE_STEP = 0.018;
const TYPE_STEP = 0.035;

/**
 * Mostra as primeiras letras de `text` na linha, de `from` até `to`, uma de
 * cada vez: para trás é apagar, da direita para a esquerda; para a frente é
 * escrever. O cursor só aparece enquanto a linha muda, e o texto só é
 * reescrito quando a contagem de letras muda, não a cada quadro.
 */
function typeLine(
  line: HTMLElement,
  caret: HTMLElement | null,
  text: string,
  from: number,
  to: number,
  step: number,
) {
  const state = { count: from };
  let shown = from;
  return gsap.to(state, {
    count: to,
    duration: Math.abs(to - from) * step,
    ease: 'none',
    onStart: () => {
      if (caret) gsap.set(caret, { autoAlpha: 1 });
    },
    onUpdate: () => {
      const count = Math.round(state.count);
      if (count === shown) return;
      shown = count;
      line.textContent = text.slice(0, count);
    },
    onComplete: () => {
      if (caret) gsap.set(caret, { autoAlpha: 0 });
    },
  });
}

function setupOutdoor() {
  const outdoor = document.querySelector<HTMLElement>('[data-outdoor]');
  if (!outdoor) return;

  const slides = gsap.utils.toArray<HTMLElement>('[data-outdoor-slide]', outdoor);

  // Com uma imagem só não há troca: o fundo fica parado nela, e o pop-up no
  // recado dela.
  if (slides.length < 2) return;

  // Os recados, um por imagem e na mesma ordem (null quando a imagem não tem).
  const popup = document.querySelector<HTMLElement>('[data-promo]');
  const promos: Promo[] = popup ? JSON.parse(popup.dataset.promo ?? '[]') : [];
  const titleLine = popup?.querySelector<HTMLElement>('[data-promo-line="title"]');
  const textLine = popup?.querySelector<HTMLElement>('[data-promo-line="text"]');
  const titleCaret = popup?.querySelector<HTMLElement>('[data-promo-caret="title"]') ?? null;
  const textCaret = popup?.querySelector<HTMLElement>('[data-promo-caret="text"]') ?? null;

  // O CSS esconde as imagens seguintes para o caso de não haver JS. Aqui elas
  // voltam a aparecer e passam a ser posicionadas pelo eixo X.
  gsap.set(slides, { opacity: 1, xPercent: 100 });
  gsap.set(slides[0], { xPercent: 0 });

  const DWELL = 4;

  let current = 0;

  const advance = () => {
    const next = (current + 1) % slides.length;
    const promo = promos[next] ?? null;

    const change = gsap.timeline({
      defaults: { duration: 0.9, ease: 'power3.inOut' },
      onComplete: wait,
    });

    change
      .to(slides[current], { xPercent: -100 }, 0)
      .fromTo(slides[next], { xPercent: 100 }, { xPercent: 0 }, 0);

    // O texto é apagado de trás para a frente — a linha de apoio e depois o
    // título — enquanto a imagem passa, e o próximo é escrito na ordem de
    // leitura depois que a imagem assenta: escrito com ela em movimento, ele
    // ficaria ilegível justamente quando pede leitura. A espera pela próxima
    // troca só começa com o texto inteiro na tela.
    if (promo && titleLine && textLine) {
      const title = titleLine.textContent ?? '';
      const text = textLine.textContent ?? '';

      const erase = gsap
        .timeline()
        .add(typeLine(textLine, textCaret, text, text.length, 0, ERASE_STEP))
        .add(typeLine(titleLine, titleCaret, title, title.length, 0, ERASE_STEP));

      const write = gsap
        .timeline()
        .add(typeLine(titleLine, titleCaret, promo.title, 0, promo.title.length, TYPE_STEP))
        .add(typeLine(textLine, textCaret, promo.text, 0, promo.text.length, TYPE_STEP));

      change.add(erase, 0).add(write);
    }

    current = next;
  };

  // A espera é um relógio invisível: não há barra de tempo na tela, a pedido
  // do cliente. Não há pausa no hover: o fundo ocupa o hero inteiro, e o
  // ponteiro passa a maior parte do tempo em cima dele — pausar ali
  // congelaria a passagem justamente para quem está lendo o hero.
  function wait() {
    gsap.delayedCall(DWELL, advance);
  }

  wait();
}

/* ------------------------------------------------------------------ *
 * Costura do cabeçalho
 * Uma agulha corre sem parar pela costura reta da base da faixa, com um
 * trecho aceso de linha atrás dela. A costura em si é CSS e fica parada;
 * só a agulha e o trecho aceso passam pelo matchMedia.
 * ------------------------------------------------------------------ */

/** O olho da agulha, em px dentro dela (Header.astro): é ali que a linha sai. */
const NEEDLE_EYE_X = 6.5;

/** Velocidade da agulha, em px/s, e o tempo mínimo de uma passada. */
const NEEDLE_SPEED = 140;
const NEEDLE_MIN_PASS = 7;

function setupNavThread() {
  const frame = document.querySelector<HTMLElement>('[data-nav-thread]');
  const trail = frame?.querySelector<HTMLElement>('[data-nav-thread-trail]');
  const trailInner = frame?.querySelector<HTMLElement>('[data-nav-thread-trail-inner]');
  const needle = frame?.querySelector<SVGSVGElement>('[data-nav-thread-needle]');
  if (!frame || !trail || !trailInner || !needle) return;

  // A agulha corre sempre na mesma velocidade, da esquerda para a direita, e
  // volta a entrar pela esquerda quando o trecho aceso some na direita — a
  // volta acontece com tudo fora da faixa, então a passagem não tem emenda.
  // É máquina, como o bordado da seção de técnicas: ease `none`.
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    let tween: gsap.core.Tween | null = null;
    const setTrail = gsap.quickSetter(trail, 'x', 'px');
    const setTrailInner = gsap.quickSetter(trailInner, 'x', 'px');
    const setNeedle = gsap.quickSetter(needle, 'x', 'px');

    // As medidas dependem da largura da faixa: quando ela muda, a passada é
    // refeita a partir do ponto em que estava.
    const start = () => {
      const progress = tween?.progress() ?? 0;
      tween?.kill();

      const width = frame.clientWidth;
      const length = gsap.utils.clamp(160, 420, width * 0.24);
      const sweep = { x: -length };
      gsap.set(trail, { width: length });
      gsap.set(trailInner, { width });
      gsap.set([trail, needle], { autoAlpha: 1 });

      tween = gsap.to(sweep, {
        x: width,
        duration: Math.max(NEEDLE_MIN_PASS, (width + length) / NEEDLE_SPEED),
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          setTrail(sweep.x);
          setTrailInner(-sweep.x);
          setNeedle(sweep.x + length - NEEDLE_EYE_X);
        },
      });
      tween.progress(progress);
    };

    start();

    let lastWidth = frame.clientWidth;
    const observer = new ResizeObserver(() => {
      if (frame.clientWidth === lastWidth) return;
      lastWidth = frame.clientWidth;
      start();
    });
    observer.observe(frame);

    return () => {
      observer.disconnect();
      tween?.kill();
      gsap.set([trail, needle], { autoAlpha: 0 });
    };
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
    const backdrop = document.querySelector<HTMLElement>('[data-anim="hero-backdrop"]');

    const intro = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.7 } });

    if (heroItems.length > 0) {
      intro.fromTo(heroItems, { opacity: 0, y: 22 }, { opacity: 1, y: 0, stagger: 0.08 });
    }

    // O fundo acende devagar e assenta de um leve zoom. Ele ocupa a seção
    // inteira, então diminuir a partir de um pouco maior nunca descobre a
    // borda — crescer a partir de um pouco menor mostraria a moldura da seção
    // em volta dele durante a entrada.
    if (backdrop) {
      intro.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power1.out' }, 0);

      const layer = backdrop.querySelector<HTMLElement>('[data-outdoor]');
      if (layer) {
        intro.fromTo(layer, { scale: 1.06 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, 0);
      }
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
          duration: 2.2,
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
  setupNavThread();
  setupReveals();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
