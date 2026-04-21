interface TechBadgesProps {
  items: string[];
  className?: string;
}

export function TechBadges({ items, className = "" }: TechBadgesProps) {
  if (!items || items.length === 0) return null;
  return (
    <ul
      className={`flex flex-wrap gap-2 ${className}`}
      aria-label="Technology stack"
    >
      {items.map((tech) => (
        <li
          key={tech}
          className="px-3 py-1 text-body-sm text-white/70 bg-white/5 border border-white/10 rounded-full hover:border-highlight/40 hover:text-white transition-colors duration-200"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}
