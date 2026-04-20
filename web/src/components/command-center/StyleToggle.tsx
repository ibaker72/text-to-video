"use client";

import { GenerationStyle } from "@/types";
import { cn } from "@/lib/utils";

const STYLES: { value: GenerationStyle; label: string }[] = [
  { value: "none",        label: "None" },
  { value: "cinematic",   label: "Cinematic" },
  { value: "render_3d",   label: "3D Render" },
  { value: "documentary", label: "Documentary" },
];

interface StyleToggleProps {
  value:    GenerationStyle;
  onChange: (style: GenerationStyle) => void;
}

export function StyleToggle({ value, onChange }: StyleToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STYLES.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => onChange(s.value)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            value === s.value
              ? "border-violet-500 bg-violet-950 text-violet-300"
              : "border-white/10 bg-transparent text-white/50 hover:border-white/20 hover:text-white/70",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
