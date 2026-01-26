import { notFound } from 'next/navigation';
import { allInsights } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { format, parseISO } from 'date-fns';
import { FadeIn } from '@/components/FadeIn';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allInsights.map((article) => ({
    slug: article.slug,
  }));
}

export const generateMetadata = ({ params }: ArticlePageProps) => {
  const article = allInsights.find((article) => article.slug === params.slug);
  if (!article) return;
  return {
    title: `${article.title} - Fredrik Westerdahl`,
    description: article.summary,
  };
};

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = allInsights.find((article) => article.slug === params.slug);

  if (!article) {
    notFound();
  }

  const MDXContent = useMDXComponent(article.body.code);

  return (
    <main className="w-full min-h-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-8 md:py-12 lg:py-16 xl:py-24 max-w-4xl mx-auto">
      <article className="max-w-2xl mx-auto mt-40 md:mt-0 pb-12 md:pb-20">
        <FadeIn>
          {article.publishedAt && (
            <div className="mb-8">
              <time dateTime={article.publishedAt} className="text-sm text-gray-500 font-mono block mb-6">
                {format(parseISO(article.publishedAt), 'MMMM d, yyyy')}
              </time>
            </div>
          )}

          <div className="prose prose-neutral prose-lg max-w-none">
            <MDXContent />
          </div>
        </FadeIn>
      </article>
    </main>
  );
}
