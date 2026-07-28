"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/*
 * Sistema de movimento extraído 1:1 do site de referência (ardene.framer.website):
 * - reveals: y 30px, spring bounce 0.2 / duração 1.5s, dispara com 50% do elemento visível
 * - títulos: por caractere, blur 10px + y 20px, spring 120/40, stagger 0.05s, início 0.1s
 * - badges: pop scale 0.85 + y 18px, spring 400/58
 * - hero/cards: encolhem a 50% + fade ao serem cobertos pela próxima seção (só ≥810px)
 * - marquee: 100px/s constante
 */

export const REVEAL_SPRING: Transition = {
  type: "spring",
  bounce: 0.2,
  duration: 1.5,
};

export const POP_SPRING: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 58,
  mass: 1,
};

export const CHAR_SPRING: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 40,
  mass: 1,
};

export const HOVER_SPRING: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 50,
  mass: 1,
};

/** true a partir do breakpoint tablet da referência (810px). */
export function useIsMdUp() {
  const [mdUp, setMdUp] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 810px)");
    const update = () => setMdUp(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mdUp;
}

/**
 * Delay responsivo: no mobile a referência colapsa a cascata de delays para 0.1s
 * (os elementos entram na viewport um a um).
 */
export function useStaggerDelay(desktop: number) {
  const mdUp = useIsMdUp();
  return mdUp ? desktop : 0.1;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** deslocamento vertical inicial em px (30 na referência) */
  y?: number;
  delay?: number;
  /** anima na montagem em vez de ao entrar na viewport (hero) */
  onMount?: boolean;
  /** fração do elemento visível para disparar (0.5 na referência) */
  amount?: number;
};

/** Fade + slide-up (30px) com spring bounce 0.2 / 1.5s, aos 50% visível, uma vez. */
export function Reveal({
  children,
  className,
  y = 30,
  delay = 0,
  onMount = false,
  amount = 0.5,
}: RevealProps) {
  const reduce = useReducedMotion();
  const initial = reduce ? { opacity: 0 } : { opacity: 0, y };
  const visible = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={initial}
      {...(onMount
        ? { animate: visible }
        : { whileInView: visible, viewport: { once: true, amount } })}
      transition={{ ...REVEAL_SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Pop de badges/labels: opacity + scale 0.85 + y 18px com spring 400/58. */
export function Pop({
  children,
  className,
  delay = 0,
  amount = 0.5,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ ...POP_SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

const CHAR_HIDDEN = {
  opacity: 0.001,
  y: 20,
  filter: "blur(10px)",
};

const CHAR_VISIBLE = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  transition: CHAR_SPRING,
};

/**
 * Título revelado caractere a caractere com blur, como os headings da referência:
 * stagger 0.05s por caractere, início após 0.1s.
 */
export function BlurTitle({
  text,
  className,
  as: Tag = "h2",
  startDelay = 0.1,
  amount = 0.5,
  onMount = false,
  ariaLabel,
}: {
  /** use "\n" para quebras de linha */
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  startDelay?: number;
  /** fração visível para disparar (títulos de card usam 1) */
  amount?: number;
  onMount?: boolean;
  ariaLabel?: string;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag];
  const lines = text.split("\n");

  if (reduce) {
    return (
      <MotionTag
        className={className}
        aria-label={ariaLabel ?? text.replace(/\n/g, " ")}
        initial={{ opacity: 0 }}
        {...(onMount
          ? { animate: { opacity: 1 } }
          : {
              whileInView: { opacity: 1 },
              viewport: { once: true, amount },
            })}
        transition={{ ...CHAR_SPRING, delay: startDelay }}
      >
        {lines.map((line, i) => (
          <span key={i} aria-hidden>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      aria-label={ariaLabel ?? text.replace(/\n/g, " ")}
      initial="hidden"
      {...(onMount
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, amount } })}
      transition={{ staggerChildren: 0.05, delayChildren: startDelay }}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} aria-hidden>
          {line.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-pre">
              {word.split("").map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  className="inline-block will-change-transform"
                  variants={{ hidden: CHAR_HIDDEN, visible: CHAR_VISIBLE }}
                >
                  {char}
                </motion.span>
              ))}
              {wordIndex < line.split(" ").length - 1 && " "}
            </span>
          ))}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ))}
    </MotionTag>
  );
}

/**
 * Seção que encolhe a 50% e faz fade-out conforme a próxima seção a cobre
 * (transform on scroll do hero e dos dois primeiros cards). Só ≥810px.
 */
export function ShrinkAway({
  children,
  className,
  /** distância em px do topo da viewport onde o efeito completa (80 no hero) */
  endOffset = 0,
}: {
  children: ReactNode;
  className?: string;
  endOffset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mdUp = useIsMdUp();
  const active = mdUp && !reduce;

  useEffect(() => {
    const wrap = ref.current;
    const inner = innerRef.current;
    if (!wrap || !inner || !active) return;
    let raf = 0;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const total = Math.max(1, rect.height - endOffset);
      const p = Math.min(1, Math.max(0, -rect.top / total));
      inner.style.transform = p > 0 ? `scale(${1 - p * 0.5})` : "";
      inner.style.opacity = p > 0 ? String(1 - p) : "";
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      inner.style.transform = "";
      inner.style.opacity = "";
    };
  }, [active, endOffset]);

  return (
    <div ref={ref} className={className}>
      <div ref={innerRef} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}

/**
 * Faixa infinita horizontal a 100px/s (velocidade do ticker da referência),
 * independente da largura do conteúdo. O conteúdo é duplicado internamente.
 */
export function Marquee({
  children,
  className,
  speed = 100,
}: {
  children: ReactNode;
  className?: string;
  /** pixels por segundo */
  speed?: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(40);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const width = el.offsetWidth;
      if (width > 0) setDuration(width / speed);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [speed]);

  return (
    <div className={className} style={{ overflow: "clip" }}>
      <div
        className="flex w-max"
        style={{ animation: `marquee ${duration}s linear infinite` }}
      >
        <div ref={contentRef} className="flex shrink-0 items-center">
          {children}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Vinheta radial das imagens da referência (5% → 30% de preto). */
export const VIGNETTE: CSSProperties = {
  background:
    "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 100%)",
};

export { motion };
