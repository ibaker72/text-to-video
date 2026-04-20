"use client";

import { useCallback, useState } from "react";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export function useImageUpload() {
  const [dataUri,   setDataUri]   = useState<string | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 10 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setDataUri(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const clear = useCallback(() => { setDataUri(null); setError(null); }, []);

  return { dataUri, error, isDragging, setIsDragging, onDrop, onFileChange, clear };
}
