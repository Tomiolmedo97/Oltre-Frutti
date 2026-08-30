import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  stacked?: boolean;
  alt?: string;
  priority?: boolean;
};

export function Logo({
  className,
  stacked = false,
  alt = "Oltre Frutti",
  priority = false,
}: LogoProps) {
  return (
    <img
      src="/brand/wordmark.webp"
      alt={alt}
      width={900}
      height={568}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      className={cn(
        "w-auto select-none",
        stacked
          ? "h-auto w-[min(92vw,20rem)] sm:w-[min(90vw,24rem)] md:w-[28rem]"
          : "h-12 max-h-12 w-auto max-w-28 object-contain",
        className,
      )}
    />
  );
}

export function LogoMark({
  className,
  alt = "",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src="/brand/mark.webp"
      alt={alt}
      width={384}
      height={384}
      decoding="async"
      draggable={false}
      className={cn("size-10 rounded-xl object-cover", className)}
    />
  );
}
