const techs = [
  "Next.js 14",
  "TypeScript",
  "Tailwind CSS",
  "MongoDB",
  "Socket.io",
  "Yjs CRDT",
  "LiveKit",
  "TanStack Query",
  "Zustand",
  "Express.js",
];

const TechStack = () => {
  return (
    <section className="py-12 border-t border-border">
      <p className="text-center text-sm text-muted-foreground mb-6 font-medium tracking-wide uppercase">
        Built with modern technologies
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {techs.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1.5 rounded-full border border-border bg-muted/50 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
