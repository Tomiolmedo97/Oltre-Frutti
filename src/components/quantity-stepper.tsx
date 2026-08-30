import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onDec: () => void;
  onInc: () => void;
  className?: string;
  compact?: boolean;
};

export function QuantityStepper({
  value,
  onDec,
  onInc,
  className,
  compact = false,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between rounded-full bg-paper ring-1 ring-leaf/15",
        compact ? "h-10" : "h-11",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDec}
        aria-label="Quitar uno"
        className={cn(
          "grid place-items-center rounded-full text-leaf transition-colors duration-150 hover:bg-leaf/10",
          compact ? "size-10" : "size-11",
        )}
      >
        <Minus className="size-4" strokeWidth={2.2} />
      </button>
      <span className="min-w-6 px-2 text-center font-display text-base tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={onInc}
        aria-label="Agregar uno"
        className={cn(
          "grid place-items-center rounded-full text-leaf transition-colors duration-150 hover:bg-leaf/10",
          compact ? "size-10" : "size-11",
        )}
      >
        <Plus className="size-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}
