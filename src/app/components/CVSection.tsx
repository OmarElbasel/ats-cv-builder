interface CVSectionProps {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}

export function CVSection({ title, children, isLast = false }: CVSectionProps) {
  return (
    <section className={!isLast ? 'mb-5 print:mb-1' : ''}>
      <h2 className="text-gray-900 mb-2 print:mb-0.5 pb-1 print:pb-0.5 border-b border-gray-300">{title}</h2>
      {children}
    </section>
  );
}
