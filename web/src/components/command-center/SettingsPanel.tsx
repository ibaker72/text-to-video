"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Settings {
  width:         number;
  height:        number;
  numFrames:     number;
  guidanceScale: number;
  seed:          string;
}

interface SettingsPanelProps {
  settings:  Settings;
  onChange:  (settings: Settings) => void;
}

function NumberInput({
  label, value, onChange, min, max, step = 1,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-white/40">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-violet-500 focus:outline-none"
      />
    </label>
  );
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors"
      >
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
        Advanced settings
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <NumberInput label="Width"    value={settings.width}         onChange={(v) => onChange({ ...settings, width: v })}         min={256}  max={1920} step={64} />
          <NumberInput label="Height"   value={settings.height}        onChange={(v) => onChange({ ...settings, height: v })}        min={144}  max={1080} step={64} />
          <NumberInput label="Frames"   value={settings.numFrames}     onChange={(v) => onChange({ ...settings, numFrames: v })}     min={17}   max={257}  step={8} />
          <NumberInput label="CFG"      value={settings.guidanceScale} onChange={(v) => onChange({ ...settings, guidanceScale: v })} min={1}    max={20}   step={0.5} />
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs text-white/40">Seed (blank = random)</span>
            <input
              type="number"
              value={settings.seed}
              placeholder="random"
              onChange={(e) => onChange({ ...settings, seed: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-violet-500 focus:outline-none"
            />
          </label>
        </div>
      )}
    </div>
  );
}
