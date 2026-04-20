"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StyleToggle } from "./StyleToggle";
import { SettingsPanel } from "./SettingsPanel";
import { GenerateRequest, GenerationStyle } from "@/types";

interface PromptFormProps {
  onSubmit:     (req: GenerateRequest) => Promise<void>;
  isSubmitting: boolean;
  sourceImage?: string | null;
}

export function PromptForm({ onSubmit, isSubmitting, sourceImage }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [style,  setStyle]  = useState<GenerationStyle>("none");
  const [settings, setSettings] = useState({
    width:         1280,
    height:        736,
    numFrames:     121,
    guidanceScale: 7.5,
    seed:          "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    await onSubmit({
      prompt,
      style,
      width:         settings.width,
      height:        settings.height,
      numFrames:     settings.numFrames,
      guidanceScale: settings.guidanceScale,
      seed:          settings.seed ? Number(settings.seed) : undefined,
      image:         sourceImage ?? undefined,
    });
    setPrompt("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your video…"
        rows={4}
        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
      />

      <div className="flex flex-col gap-3">
        <StyleToggle value={style} onChange={setStyle} />
        <SettingsPanel settings={settings} onChange={setSettings} />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !prompt.trim()}
        className="w-full gap-2"
        size="lg"
      >
        <Wand2 className="h-4 w-4" />
        {isSubmitting ? "Submitting…" : "Generate"}
      </Button>
    </form>
  );
}
