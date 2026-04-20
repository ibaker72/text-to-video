"use client";

import { useCallback, useEffect, useState } from "react";
import { Generation } from "@/types";

const PAGE_SIZE = 20;

export function useGenerations() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [hasMore,     setHasMore]     = useState(false);
  const [offset,      setOffset]      = useState(0);

  const fetchPage = useCallback(async (pageOffset: number, replace = false) => {
    setIsLoading(true);
    const res = await fetch(`/api/generations?limit=${PAGE_SIZE}&offset=${pageOffset}`);
    if (!res.ok) { setIsLoading(false); return; }
    const { data, count } = await res.json();
    setGenerations((prev) => replace ? data : [...prev, ...data]);
    setOffset(pageOffset + data.length);
    setHasMore((count ?? 0) > pageOffset + data.length);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchPage(0, true); }, [fetchPage]);

  const loadMore = useCallback(() => fetchPage(offset), [fetchPage, offset]);
  const refresh  = useCallback(() => fetchPage(0, true), [fetchPage]);

  return { generations, isLoading, hasMore, loadMore, refresh };
}
