import { CommandCenter } from "@/components/command-center/CommandCenter";

export const metadata = { title: "Studio — Motif Vault" };

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Studio</h1>
        <p className="mt-1 text-sm text-white/40">
          Generate videos with Motif-Video-2B
        </p>
      </div>
      <CommandCenter />
    </div>
  );
}
