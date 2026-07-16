type PublicPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PublicPageHeader({
  eyebrow,
  title,
  description,
}: PublicPageHeaderProps) {
  return (
    <header className="mx-auto max-w-4xl pb-16 pt-28 text-center sm:pt-32 lg:pt-40">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
        {eyebrow}
      </p>

      <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
        {description}
      </p>
    </header>
  );
}
