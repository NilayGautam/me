const widths = [480, 800, 1200] as const;
const srcSet = (format: string) =>
  widths.map((w) => `/images/portrait-${w}.${format} ${w}w`).join(", ");

/** Hero photo. Pre-sized by `scripts/optimize-portrait.mjs`, so no image server is needed. */
export function Portrait({
  sizes,
  className = "",
  priority = true,
}: {
  sizes: string;
  className?: string;
  /** The home hero loads it first; other pages load it lazily. */
  priority?: boolean;
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src="/images/portrait-800.jpg"
        srcSet={srcSet("jpg")}
        sizes={sizes}
        width={1600}
        height={2000}
        alt="Nilay Gautam kneeling on a beach with two beagles"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}
