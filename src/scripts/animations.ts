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
 * O recado de cada imagem mora na legenda, fora do fundo esmaecido, e
 * troca junto com ela.
 * ------------------------------------------------------------------ */
function setupOutdoor() {
  const outdoor = document.querySelector<HTMLElement>('[data-outdoor]');
  if (!outdoor) return;

  const slides = gsap.utils.toArray<HTMLElement>('[data-outdoor-slide]', outdoor);

  // Com uma imagem só não há troca: o fundo fica parado nela, e a legenda já
  // mostra o recado dela pelo CSS.
  if (slides.length < 2) return;

  // Um recado por imagem, na mesma ordem — vazio quando a imagem não tem —,
  // então o recado da imagem da vez é o da mesma posição.
  const promos = gsap.utils.toArray<HTMLElement>('[data-outdoor-promo]');
  const partsOf = (index: number) => Array.from(promos[index]?.children ?? []);

  // O recado sobe depois que a imagem assenta: entrar junto com ela em
  // movimento deixa o texto ilegível justamente no momento em que ele pede
  // leitura. E sai assim que a imagem dele começa a sair.
  const showPromo = (index: number) => {
    const parts = partsOf(index);
    if (parts.length === 0) return;
    // O recado é um cartão, e entra como pop-up: cresce de um pouco menor,
    // com um rebote curto no fim.
    gsap.fromTo(
      parts,
      { opacity: 0, y: 16, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.7)' },
    );
  };

  const hidePromo = (index: number) => {
    const parts = partsOf(index);
    if (parts.length === 0) return;
    gsap.to(parts, { opacity: 0, y: -10, scale: 0.95, duration: 0.3, ease: 'power2.in' });
  };

  // O CSS esconde as imagens seguintes para o caso de não haver JS. Aqui elas
  // voltam a aparecer e passam a ser posicionadas pelo eixo X.
  gsap.set(slides, { opacity: 1, xPercent: 100 });
  gsap.set(slides[0], { xPercent: 0 });

  // Na legenda o CSS também só mostra o primeiro recado. Daqui em diante quem
  // decide é a passagem: o primeiro fica à vista, e os outros esperam a vez.
  if (promos.length > 0) gsap.set(promos, { opacity: 1 });
  promos.forEach((_, index) => {
    const parts = partsOf(index);
    if (index > 0 && parts.length > 0) gsap.set(parts, { opacity: 0 });
  });

  const DWELL = 4.5;

  let current = 0;

  const advance = () => {
    const next = (current + 1) % slides.length;
    hidePromo(current);

    gsap
      .timeline({
        defaults: { duration: 0.9, ease: 'power3.inOut' },
        onComplete: () => {
          showPromo(next);
          wait();
        },
      })
      .to(slides[current], { xPercent: -100 }, 0)
      .fromTo(slides[next], { xPercent: 100 }, { xPercent: 0 }, 0);

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
 * Linha de bordado do cabeçalho
 * Uma linha de pontos atravessa a faixa azul passando por baixo de uma
 * opção e por cima da seguinte, como a linha de um bordado entrando e
 * saindo do tecido. O caminho depende de onde as opções caem, então ele é
 * medido aqui e refeito quando a faixa muda de tamanho ou a fonte chega.
 * A linha é desenho e aparece mesmo com "reduzir movimento"; só a agulha e
 * o trecho aceso que corre atrás dela passam pelo matchMedia.
 * ------------------------------------------------------------------ */
interface ThreadBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Uma parada da linha: uma opção (com a caixa dela) ou um ponto num vão. */
interface ThreadStop {
  x1: number;
  x2: number;
  y: number;
  box?: ThreadBox;
}

/** Um trecho: reto quando y0 e y1 são iguais, uma curva em S quando não. */
interface ThreadSegment {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

const THREAD = {
  /** Opções mais próximas que isso contam como uma só (o tema e o orçamento). */
  mergeGap: 20,
  /** Folga entre a linha e a opção quando a linha troca de lado. */
  clear: 8,
  /** Quanto a curva pode começar antes do fim da opção, por baixo ou por cima. */
  maxOverlap: 40,
  /** A cada tanto de vão vazio, uma onda a mais, para a linha não esticar. */
  waveEvery: 200,
  /** Margem mínima para a borda da faixa ganhar uma subida própria. */
  edge: 40,
  /** Velocidade da agulha, em px/s, e o tempo mínimo de uma passada. */
  speed: 140,
  minPass: 7,
};

/** O olho da agulha no desenho dela (Header.astro): é ali que a linha sai. */
const NEEDLE_EYE = { x: 5.2, y: 4 };

// Com os pontos de controle da curva em 1/3 e 2/3 da largura, o x anda
// reto com t e o y segue esta suavização — então dá para achar o y de
// qualquer x sem resolver a curva.
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Quanto a curva entre duas paradas pode avançar sobre cada uma delas sem
 * encostar no texto ou no botão: a travessia de um lado para o outro tem
 * que acontecer no vão, mas o começo e o fim dela podem passar por baixo
 * ou por cima da opção, que é o que deixa a onda larga em vez de um zigue.
 */
function threadReach(a: ThreadStop, b: ThreadStop, from: number): [number, number] {
  const gap = b.x1 - a.x2;
  const rise = Math.abs(b.y - a.y);

  // A distância do trilho da linha até a borda da opção, menos a folga.
  const room = (stop: ThreadStop) => {
    const box = stop.box;
    if (!box) return Infinity;
    return stop.y > box.bottom
      ? stop.y - box.bottom - THREAD.clear
      : box.top - THREAD.clear - stop.y;
  };

  const capA = a.box ? Math.max(0, Math.min(THREAD.maxOverlap, a.x2 - from)) : 0;
  const capB = b.box ? Math.min(THREAD.maxOverlap, (b.x2 - b.x1) / 2) : 0;
  const roomA = room(a);
  const roomB = room(b);

  const fits = (reach: number) => {
    const inA = Math.min(reach, capA);
    const inB = Math.min(reach, capB);
    const span = gap + inA + inB;
    if (span <= 0) return true;
    const clearsA = inA === 0 || smoothstep(inA / span) * rise <= roomA;
    const clearsB = inB === 0 || (1 - smoothstep((inA + gap) / span)) * rise <= roomB;
    return clearsA && clearsB;
  };

  let low = 0;
  let high = Math.max(capA, capB);
  for (let step = 0; step < 16; step += 1) {
    const mid = (low + high) / 2;
    if (fits(mid)) low = mid;
    else high = mid;
  }

  return [Math.min(low, capA), Math.min(low, capB)];
}

function traceThread(frame: HTMLElement, items: HTMLElement[]) {
  const bounds = frame.getBoundingClientRect();
  const { width, height } = bounds;
  if (width === 0 || height === 0) return null;

  // As opções que estão na faixa agora. No celular os links moram no painel
  // do menu, abaixo da faixa, e ficam de fora.
  const boxes: ThreadBox[] = [];
  items
    .map((item) => item.getBoundingClientRect())
    .filter(
      (rect) => rect.width > 0 && rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1,
    )
    .sort((a, b) => a.left - b.left)
    .forEach((rect) => {
      const box = {
        left: rect.left - bounds.left,
        right: rect.right - bounds.left,
        top: rect.top - bounds.top,
        bottom: rect.bottom - bounds.top,
      };
      const last = boxes[boxes.length - 1];
      if (last && box.left - last.right < THREAD.mergeGap) {
        last.right = Math.max(last.right, box.right);
        last.top = Math.min(last.top, box.top);
        last.bottom = Math.max(last.bottom, box.bottom);
      } else {
        boxes.push(box);
      }
    });

  if (boxes.length === 0) return null;

  // Os dois trilhos: no meio da folga entre a borda da faixa e a opção mais
  // alta, em cima e embaixo.
  const over = Math.min(...boxes.map((box) => box.top)) / 2;
  const under = (Math.max(...boxes.map((box) => box.bottom)) + height) / 2;
  const opposite = (y: number) => (y === under ? over : under);

  // As paradas, da esquerda para a direita: cada opção, e um ponto no meio
  // de cada vão largo, onde a linha faz a onda dela.
  const spots: Array<Omit<ThreadStop, 'y'>> = [];
  const fill = (from: number, to: number) => {
    const count = Math.max(0, Math.round((to - from - 60) / THREAD.waveEvery));
    for (let index = 1; index <= count; index += 1) {
      const x = from + ((to - from) * index) / (count + 1);
      spots.push({ x1: x, x2: x });
    }
  };

  let cursor = 0;
  boxes.forEach((box) => {
    fill(cursor, box.left);
    spots.push({ x1: box.left, x2: box.right, box });
    cursor = box.right;
  });
  fill(cursor, width);

  // Os lados alternam de uma parada para a outra; a primeira opção — a águia —
  // fica por baixo.
  const first = spots.findIndex((spot) => spot.box);
  const stops: ThreadStop[] = spots.map((spot, index) => ({
    ...spot,
    y: (index - first) % 2 === 0 ? under : over,
  }));

  // Nas bordas da faixa, a linha só sobe ou desce se houver margem para isso.
  const head = stops[0];
  const tail = stops[stops.length - 1];
  const path: ThreadStop[] = [
    { x1: 0, x2: 0, y: head.x1 >= THREAD.edge ? opposite(head.y) : head.y },
    ...stops,
    { x1: width, x2: width, y: width - tail.x2 >= THREAD.edge ? opposite(tail.y) : tail.y },
  ];

  const segments: ThreadSegment[] = [];
  let x = 0;
  for (let index = 0; index < path.length - 1; index += 1) {
    const a = path[index];
    const b = path[index + 1];
    if (a.y === b.y) continue;

    const [inA, inB] = threadReach(a, b, x);
    const start = a.x2 - inA;
    const end = b.x1 + inB;
    if (start > x) segments.push({ x0: x, x1: start, y0: a.y, y1: a.y });
    segments.push({ x0: start, x1: end, y0: a.y, y1: b.y });
    x = end;
  }
  const last = path[path.length - 1];
  if (x < width) segments.push({ x0: x, x1: width, y0: last.y, y1: last.y });

  const round = (value: number) => Math.round(value * 10) / 10;
  let d = `M0 ${round(path[0].y)}`;
  segments.forEach(({ x0, x1, y0, y1 }) => {
    if (y0 === y1) {
      d += ` L${round(x1)} ${round(y1)}`;
    } else {
      const third = (x1 - x0) / 3;
      d += ` C${round(x0 + third)} ${round(y0)} ${round(x1 - third)} ${round(y1)} ${round(x1)} ${round(y1)}`;
    }
  });

  // A altura e a inclinação da linha num x qualquer, para a agulha.
  const at = (position: number) => {
    const clamped = Math.min(Math.max(position, 0), width);
    const segment = segments.find((item) => clamped <= item.x1) ?? segments[segments.length - 1];
    const span = segment.x1 - segment.x0 || 1;
    const t = (clamped - segment.x0) / span;
    const rise = segment.y1 - segment.y0;
    return {
      y: segment.y0 + rise * smoothstep(t),
      slope: (rise * 6 * t * (1 - t)) / span,
    };
  };

  return { width, d, at };
}

function setupNavThread() {
  const frame = document.querySelector<HTMLElement>('[data-nav-thread]');
  const header = frame?.closest<HTMLElement>('[data-header]');
  const trail = frame?.querySelector<HTMLElement>('[data-nav-thread-trail]');
  const trailInner = frame?.querySelector<HTMLElement>('[data-nav-thread-trail-inner]');
  const needle = frame?.querySelector<SVGSVGElement>('[data-nav-thread-needle]');
  if (!frame || !header || !trail || !trailInner || !needle) return;

  const paths = Array.from(frame.querySelectorAll<SVGPathElement>('[data-nav-thread-path]'));
  const items = Array.from(header.querySelectorAll<HTMLElement>('[data-nav-thread-item]'));

  let thread: ReturnType<typeof traceThread> = null;
  let restart: (() => void) | null = null;

  const draw = () => {
    thread = traceThread(frame, items);
    paths.forEach((path) => path.setAttribute('d', thread?.d ?? ''));
    if (thread) gsap.set(trailInner, { width: thread.width });
    restart?.();
  };

  draw();

  // A agulha corre sempre na mesma velocidade, da esquerda para a direita, e
  // volta a entrar pela esquerda quando o trecho aceso some na direita — a
  // volta acontece com tudo fora da faixa, então a passagem não tem emenda.
  // É máquina, como o bordado da seção de técnicas: ease `none`.
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    let tween: gsap.core.Tween | null = null;
    const setTrail = gsap.quickSetter(trail, 'x', 'px');
    const setTrailInner = gsap.quickSetter(trailInner, 'x', 'px');
    const setNeedleX = gsap.quickSetter(needle, 'x', 'px');
    const setNeedleY = gsap.quickSetter(needle, 'y', 'px');
    const setNeedleAngle = gsap.quickSetter(needle, 'rotation', 'deg');

    restart = () => {
      const progress = tween?.progress() ?? 0;
      tween?.kill();
      tween = null;

      const current = thread;
      if (!current) {
        gsap.set([trail, needle], { autoAlpha: 0 });
        return;
      }

      const length = gsap.utils.clamp(160, 420, current.width * 0.24);
      const sweep = { x: -length };
      gsap.set(trail, { width: length });
      gsap.set([trail, needle], { autoAlpha: 1 });

      tween = gsap.to(sweep, {
        x: current.width,
        duration: Math.max(THREAD.minPass, (current.width + length) / THREAD.speed),
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          setTrail(sweep.x);
          setTrailInner(-sweep.x);
          const tip = sweep.x + length;
          const { y, slope } = current.at(tip);
          setNeedleX(tip - NEEDLE_EYE.x);
          setNeedleY(y - NEEDLE_EYE.y);
          setNeedleAngle((Math.atan(slope) * 180) / Math.PI);
        },
      });
      tween.progress(progress);
    };

    restart();

    return () => {
      tween?.kill();
      restart = null;
      gsap.set([trail, needle], { autoAlpha: 0 });
    };
  });

  // Refaz o caminho quando a faixa muda de largura, quando uma opção muda de
  // tamanho (a fonte do slogan chega depois e alarga os links) ou quando o
  // menu passa de barra para painel. Uma vez por quadro, no máximo.
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      draw();
    });
  };

  const observer = new ResizeObserver(schedule);
  observer.observe(header);
  items.forEach((item) => observer.observe(item));
  document.fonts?.ready.then(schedule);
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
