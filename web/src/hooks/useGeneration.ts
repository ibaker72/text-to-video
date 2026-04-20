"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Generation } from "@/types";

export function useGeneration(id: string) {
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function fetchInitial() {
      const res = await fetch(`/api/generations/${id}`);
      if (!res.ok) {
        setError(new Error("Generation not found"));
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      if (!cancelled) {
        setGeneration(data);
        setIsLoading(false);
      }
    }

    fetchInitial();

    const channel = supabase
      .channel(`generation:${id}`)
      .on(
        "postgres_changes",
        {
          event:  "UPDATE",
          schema: "public",
          table:  "generations",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (!cancelled) setGeneration(payload.new as Generation);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { generation, isLoading, error };
}
