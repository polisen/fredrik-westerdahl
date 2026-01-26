import { notFound } from 'next/navigation';
import { allCaseStudies } from 'contentlayer/generated';
import { CaseView } from '@/components/CaseView';
import { FadeIn } from '@/components/FadeIn';

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allCaseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export const generateMetadata = ({ params }: CaseStudyPageProps) => {
  const caseStudy = allCaseStudies.find((item) => item.slug === params.slug);
  if (!caseStudy) return;
  return {
    title: `${caseStudy.title} - Fredrik Westerdahl`,
    description: caseStudy.subtitle || caseStudy.tagline,
  };
};

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const caseStudy = allCaseStudies.find((item) => item.slug === params.slug);

  if (!caseStudy) {
    notFound();
  }
  return (
    <main className="w-full min-h-screen">
      <FadeIn>
        <CaseView caseStudy={caseStudy} />
      </FadeIn>
    </main>
  );
}
