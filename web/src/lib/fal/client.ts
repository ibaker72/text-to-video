const FAL_ENDPOINT_URL = process.env.FAL_ENDPOINT_URL!;
const FAL_API_KEY      = process.env.FAL_API_KEY!;

function falHeaders() {
  return {
    Authorization: `Key ${FAL_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function callFalGenerate(payload: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${FAL_ENDPOINT_URL}/generate`, {
    method:  "POST",
    headers: falHeaders(),
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fal submit failed ${res.status}: ${text}`);
  }
  const { request_id } = await res.json();
  return request_id as string;
}

export async function pollFalStatus(
  requestId:  string,
  onProgress: (pct: number) => Promise<void>,
): Promise<{ video_url: string; duration_seconds: number; seed_used: number }> {
  const statusUrl = `${FAL_ENDPOINT_URL}/requests/${requestId}/status`;
  const resultUrl = `${FAL_ENDPOINT_URL}/requests/${requestId}`;

  while (true) {
    const res  = await fetch(statusUrl, { headers: falHeaders() });
    const body = await res.json();

    if (body.status === "COMPLETED") {
      const result = await fetch(resultUrl, { headers: falHeaders() }).then((r) => r.json());
      return result;
    }
    if (body.status === "FAILED") {
      throw new Error(body.error ?? "Fal generation failed");
    }

    await onProgress(body.progress_pct ?? 0);
    await new Promise((r) => setTimeout(r, 5_000));
  }
}
