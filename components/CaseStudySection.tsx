import { ReactNode } from "react";

interface CaseStudySectionProps {
  title: string;
  children: ReactNode;
}

export function CaseStudySection({ title, children }: CaseStudySectionProps) {
  return (
    <div className="relative">
      <div className=" inset-2 sticky top-[72px] left-[4px] z-40 pointer-events-none pb-2">
        <div className="inline-block bg-white p-1 backdrop-blur-md text-xl px-2 rounded-md shadow-sm ml-4 md:ml-32 pointer-events-auto capitalize">
          {title?.toWellFormed()}
        </div>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
