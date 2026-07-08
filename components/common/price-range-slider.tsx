"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type PriceRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  /** Controlled range: [low, high]. */
  value: [number, number];
  /** Fires continuously while dragging/typing. */
  onChange: (value: [number, number]) => void;
  /** Fires when interaction settles (pointer release / input blur / Enter). */
  onCommit?: (value: [number, number]) => void;
};

const rangeThumb =
  "pointer-events-none absolute inset-x-0 top-1/2 m-0 h-1 w-full -translate-y-1/2 appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-bg [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-track]:bg-transparent";

const numberInput = "h-auto w-full py-2 pl-8 pr-2 text-sm";

function groupDigits(n: number): string {
  return n.toLocaleString("id-ID");
}
function parseDigits(text: string): number {
  const digits = text.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}
function pct(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

/**
 * PriceRangeSlider — branded dual-thumb price selector. Drag either handle,
 * type an exact value in the Rp fields, or use a quick-click preset (passed by
 * the parent). Presentational: state & URL sync live in the caller.
 */
export function PriceRangeSlider({
  min,
  max,
  step = 50_000,
  value,
  onChange,
  onCommit,
}: PriceRangeSliderProps) {
  const [lo, hi] = value;
  const [loText, setLoText] = useState(() => groupDigits(lo));
  const [hiText, setHiText] = useState(() => groupDigits(hi));

  // Keep text fields in sync when the range changes from the slider or presets.
  useEffect(() => setLoText(groupDigits(lo)), [lo]);
  useEffect(() => setHiText(groupDigits(hi)), [hi]);

  function commitLo(raw: number) {
    const next = Math.max(min, Math.min(raw, hi - step));
    const pair: [number, number] = [next, hi];
    onChange(pair);
    onCommit?.(pair);
  }
  function commitHi(raw: number) {
    const next = Math.min(max, Math.max(raw, lo + step));
    const pair: [number, number] = [lo, next];
    onChange(pair);
    onCommit?.(pair);
  }

  const loPct = pct(lo, min, max);
  const hiPct = pct(hi, min, max);

  return (
    <div className="flex flex-col gap-4">
      {/* Rail */}
      <div className="relative flex h-5 items-center">
        <div className="absolute inset-x-0 h-1 rounded-full bg-border" />
        <div
          className="absolute h-1 rounded-full bg-gold"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label="Harga minimum"
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])}
          onMouseUp={() => onCommit?.([lo, hi])}
          onTouchEnd={() => onCommit?.([lo, hi])}
          onKeyUp={() => onCommit?.([lo, hi])}
          className={rangeThumb}
          style={{ zIndex: lo > max - (max - min) / 2 ? 30 : 20 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label="Harga maksimum"
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
          onMouseUp={() => onCommit?.([lo, hi])}
          onTouchEnd={() => onCommit?.([lo, hi])}
          onKeyUp={() => onCommit?.([lo, hi])}
          className={rangeThumb}
          style={{ zIndex: 25 }}
        />
      </div>

      {/* Typed inputs */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <label className="relative block">
          <span className="sr-only">Harga minimum</span>
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-sans text-xs text-fg-subtle">
            Rp
          </span>
          <Input
            inputMode="numeric"
            value={loText}
            onChange={(e) => setLoText(e.target.value)}
            onBlur={() => commitLo(parseDigits(loText))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitLo(parseDigits(loText));
              }
            }}
            className={numberInput}
          />
        </label>
        <span className="font-sans text-sm text-fg-subtle">–</span>
        <label className="relative block">
          <span className="sr-only">Harga maksimum</span>
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-sans text-xs text-fg-subtle">
            Rp
          </span>
          <Input
            inputMode="numeric"
            value={hiText}
            onChange={(e) => setHiText(e.target.value)}
            onBlur={() => commitHi(parseDigits(hiText))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitHi(parseDigits(hiText));
              }
            }}
            className={numberInput}
          />
        </label>
      </div>
    </div>
  );
}
