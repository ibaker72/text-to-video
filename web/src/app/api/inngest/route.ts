import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateVideoFn } from "@/lib/inngest/functions/generateVideo";

export const { GET, POST, PUT } = serve({
  client:    inngest,
  functions: [generateVideoFn],
});
