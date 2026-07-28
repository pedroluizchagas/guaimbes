import Image from "next/image";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/** Margens laterais padrão do site (20px mobile / 40px desktop). */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-5 md:px-10 ${className}`}>{children}</div>;
}

/** Ícone da folha de guaimbê (equivalente ao ✺ do design de referência). */
export function Leaf({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/guaimbes-icon.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={`inline-block object-contain ${className}`}
    />
  );
}

/** Wordmark em texto — minúsculas, tracking apertado, como no design system. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`lowercase font-[440] tracking-[-0.03em] [font-optical-sizing:auto] ${className}`}
    >
      guaimbês
    </span>
  );
}

type PillButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  /** "dark" = fundo ink (padrão), "cream" = fundo creme */
  tone?: "dark" | "cream";
};

/** Botão pílula DM Mono uppercase com seta, hover invertido em terracota. */
export function PillButton({
  children,
  tone = "dark",
  className = "",
  ...props
}: PillButtonProps) {
  const tones =
    tone === "dark"
      ? "bg-ink text-cream hover:bg-terra hover:text-cream"
      : "bg-cream text-ink hover:bg-terra hover:text-cream";
  return (
    <a
      {...props}
      className={`mono-label inline-flex items-center gap-2 rounded-md px-4 py-2.5 transition-colors duration-[400ms] ease-out ${tones} ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </a>
  );
}

/** Link DM Mono uppercase sublinhado (estilo "RESIDENCES" da referência). */
export function UnderlineLink({
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a
      {...props}
      className={`mono-label underline underline-offset-[6px] decoration-[1px] transition-colors duration-300 hover:text-terra ${className}`}
    >
      {children}
    </a>
  );
}
