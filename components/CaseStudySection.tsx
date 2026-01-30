import { ReactNode } from "react";

interface CaseStudySectionProps {
  title: string;
  children: ReactNode;
}

export function CaseStudySection({ title, children }: CaseStudySectionProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="sticky pl-0.5 top-[72px]">
          <div className="inline-block bg-gray-200/80 p-1 backdrop-blur-md text-xl px-2 rounded-md shadow-sm ml-4 md:ml-32 pointer-events-auto">
            {title}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
