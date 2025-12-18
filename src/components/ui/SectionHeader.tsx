interface SectionHeaderProps {
  tag?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export const SectionHeader = ({
  tag,
  title,
  description,
  centered = false,
}: SectionHeaderProps) => {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {tag && (
        <span className="code-tag mb-4 inline-block animate-fade-up">
          {tag}
        </span>
      )}
      <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4 animate-fade-up animation-delay-100">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-2xl animate-fade-up animation-delay-200">
          {description}
        </p>
      )}
    </div>
  );
};
