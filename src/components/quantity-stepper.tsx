import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { formatQty } from "@/lib/format";
import {
  WEIGHT_PRESETS,
  editValue,
  isWeightUnit,
  parseWeightInput,
} from "@/lib/quantity";
import type { Unit } from "@/lib/products";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  unit: Unit;
  onDec: () => void;
  onInc: () => void;
  onChange: (qty: number) => void;
  className?: string;
  compact?: boolean;
};

export function QuantityStepper({
  value,
  unit,
  onDec,
  onInc,
  onChange,
  className,
  compact = false,
}: QuantityStepperProps) {
  const weight = isWeightUnit(unit);
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(() => editValue(value, unit));

  useEffect(() => {
    if (!focused) setDraft(editValue(value, unit));
  }, [value, unit, focused]);

  function commit(raw: string) {
    setFocused(false);
    if (weight) {
      const parsed = parseWeightInput(raw);
      if (parsed == null) {
        setDraft(editValue(value, unit));
        return;
      }
      onChange(parsed);
      return;
    }
    const n = Number.parseInt(raw.replace(",", "."), 10);
    if (!Number.isFinite(n)) {
      setDraft(editValue(value, unit));
      return;
    }
    onChange(n);
  }

  const suffix = weight ? (value >= 1 ? "kg" : "g") : "";

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div
        className={cn(
          "inline-flex items-center justify-between rounded-full bg-paper ring-1 ring-leaf/15",
          compact ? "h-10" : "h-11",
        )}
      >
        <button
          type="button"
          onClick={onDec}
          aria-label={weight ? "Quitar 100 gramos" : "Quitar uno"}
          className={cn(
            "grid place-items-center rounded-full text-leaf transition-colors duration-150 hover:bg-leaf/10",
            compact ? "size-10" : "size-11",
          )}
        >
          <Minus className="size-4" strokeWidth={2.2} />
        </button>
        <label className="flex min-w-0 flex-1 items-center justify-center gap-1">
          <span className="sr-only">
            Cantidad{weight ? " en gramos o kilos" : ""}
          </span>
          <input
            inputMode="decimal"
            value={focused ? draft : editValue(value, unit)}
            onFocus={(event) => {
              setFocused(true);
              setDraft(editValue(value, unit));
              event.currentTarget.select();
            }}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={(event) => commit(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            aria-label={`Cantidad: ${formatQty(value, unit)}`}
            className="w-16 min-w-0 bg-transparent text-center font-display text-base tabular-nums text-ink outline-none"
          />
          {suffix ? (
            <span className="text-xs font-medium text-ink-muted">{suffix}</span>
          ) : null}
        </label>
        <button
          type="button"
          onClick={onInc}
          aria-label={weight ? "Sumar 100 gramos" : "Agregar uno"}
          className={cn(
            "grid place-items-center rounded-full text-leaf transition-colors duration-150 hover:bg-leaf/10",
            compact ? "size-10" : "size-11",
          )}
        >
          <Plus className="size-4" strokeWidth={2.2} />
        </button>
      </div>
      {weight && !compact ? (
        <div className="flex flex-wrap gap-1.5">
          {WEIGHT_PRESETS.map((preset) => {
            const selected = Math.abs(value - preset.qty) < 0.0005;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.qty)}
                className={cn(
                  "h-8 rounded-full px-2.5 text-xs font-medium",
                  selected
                    ? "bg-leaf text-cream"
                    : "bg-paper text-ink ring-1 ring-ink/10 hover:bg-sun/40",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
