import { GenerationCard } from "./GenerationCard";

interface ActiveJobsProps {
  ids: string[];
}

export function ActiveJobs({ ids }: ActiveJobsProps) {
  return (
    <div className="flex flex-col gap-3">
      {ids.map((id) => (
        <GenerationCard key={id} id={id} />
      ))}
    </div>
  );
}
