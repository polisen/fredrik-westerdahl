import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface CaseStudySectionProps {
  title: string;
  visitUrl?: string;
  children: ReactNode;
}

export function CaseStudySection({
  title,
  visitUrl,
  children,
}: CaseStudySectionProps) {
  return (
    <div className="relative">
      <div className="inset-2 sticky top-[72px] left-[4px] z-40 pointer-events-none pb-2 flex items-center  gap-2 ml-4 md:ml-32 pr-4 md:pr-32">
        <div className="inline-block bg-white p-1 backdrop-blur-md text-xl px-2 rounded-md shadow-sm pointer-events-auto capitalize">
          {title?.toWellFormed()}
        </div>
        {visitUrl && (
          <a
            href={visitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-4 rounded-md bg-white/80 text-black text-lg font-normal  hover:bg-white transition-colors flex items-center justify-center gap-1.5 pointer-events-auto shrink-0"
          >
            Visit
            <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
