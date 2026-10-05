import Image from "next/image";

// Imagen optimizada (next/image: responsive + lazy + caché).
// Las clases de forma/tamaño van en el wrapper; el relleno es object-cover.
export function ShopImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  sizes = "(max-width: 640px) 50vw, 33vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) return <div className={`relative bg-seda-soft ${className}`} aria-hidden />;
  return (
    <div className={`relative ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} draggable={false} className={`object-cover ${imgClassName}`} />
    </div>
  );
}
