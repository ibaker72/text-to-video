"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploadProps {
  onImageReady: (dataUri: string) => void;
  onClear:      () => void;
  currentImage: string | null;
}

export function ImageUpload({ onImageReady, onClear, currentImage }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { error, isDragging, setIsDragging, onDrop, onFileChange } = useImageUpload();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    onFileChange(e);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onImageReady(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  if (currentImage) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentImage} alt="Source" className="max-h-48 w-full object-contain" />
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white/70 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-10 transition-colors",
          isDragging
            ? "border-violet-500 bg-violet-950/20"
            : "border-white/10 hover:border-white/20",
        )}
      >
        <ImagePlus className="h-8 w-8 text-white/20" />
        <p className="text-sm text-white/40">Drop image here or click to upload</p>
        <p className="text-xs text-white/20">PNG, JPG, WEBP — max 10 MB</p>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
