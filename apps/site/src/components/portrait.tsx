import photos from "@/photos.json";

/**
 * A photo from `src/photos.json`. Pre-sized by `scripts/optimize-photos.mjs`, so no image server is needed.
 * `portrait` is the home hero; `night` is the About page photo.
 */
export function Portrait({
  photo = "portrait",
  sizes,
  className = "",
  priority = true,
}: {
  photo?: keyof typeof photos;
  sizes: string;
  className?: string;
  /** The home hero loads it first; other pages load it lazily. */
  priority?: boolean;
}) {
  const { widths, width, height, alt } = photos[photo];
  const srcSet = (format: string) =>
    widths.map((w) => `/images/${photo}-${w}.${format} ${w}w`).join(", ");
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`/images/${photo}-${widths[0]}.jpg`}
        srcSet={srcSet("jpg")}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}
