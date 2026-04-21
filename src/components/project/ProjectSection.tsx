import type { ReactNode } from "react";

interface ProjectSectionProps {
  eyebrow?: string; // tiny label above title, e.g. "01 / The Problem"
  title: string;
  body: string; // paragraph text; splits on \n\n for multiple paragraphs
  children?: ReactNode; // optional extra content (badges, images) below body
}

export function ProjectSection({
  eyebrow,
  title,
  body,
  children,
}: ProjectSectionProps) {
  const paragraphs = body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return (
    <section className="py-12 md:py-16">
      {eyebrow && (
        <p className="text-body-sm uppercase tracking-[0.3em] text-highlight/80 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-h3 md:text-h2 text-white font-medium mb-6 md:mb-8 max-w-3xl">
        {title}
      </h2>
      <div className="max-w-3xl text-body-lg text-white/75 leading-relaxed space-y-4 md:space-y-5">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      {children && <div className="mt-8 md:mt-10">{children}</div>}
    </section>
  );
}
