import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const limit  = Math.min(Number(req.nextUrl.searchParams.get("limit")  ?? 20), 100);
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0);
  const supabase = createServerClient();

  const { data, error, count } = await supabase
    .from("generations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, count });
}
