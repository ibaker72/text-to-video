"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PromptForm } from "./PromptForm";
import { ImageUpload } from "./ImageUpload";
import { ActiveJobs } from "@/components/generation/ActiveJobs";
import { GenerateRequest } from "@/types";

export function CommandCenter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab,    setActiveTab]    = useState("t2v");
  const [sourceImage,  setSourceImage]  = useState<string | null>(null);
  const [jobIds,       setJobIds]       = useState<string[]>([]);

  async function handleSubmit(req: GenerateRequest) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(req),
      });
      if (!res.ok) throw new Error("Generation request failed");
      const { id } = await res.json();
      setJobIds((prev) => [id, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="t2v">Text → Video</TabsTrigger>
          <TabsTrigger value="i2v">Image → Video</TabsTrigger>
        </TabsList>

        <TabsContent value="t2v">
          <PromptForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </TabsContent>

        <TabsContent value="i2v">
          <div className="flex flex-col gap-4">
            <ImageUpload
              onImageReady={setSourceImage}
              onClear={() => setSourceImage(null)}
              currentImage={sourceImage}
            />
            <PromptForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              sourceImage={sourceImage}
            />
          </div>
        </TabsContent>
      </Tabs>

      {jobIds.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-white/30">
            Active jobs
          </h3>
          <ActiveJobs ids={jobIds} />
        </div>
      )}
    </div>
  );
}
