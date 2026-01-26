import Link from 'next/link';
import { allInsights } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { FadeIn } from '@/components/FadeIn';

export const metadata = {
  title: 'Articles - Fredrik Westerdahl',
  description: 'Technical writing and thoughts on systems design.',
};

export default function ArticlesPage() {
  const articles = allInsights.sort((a, b) =>
    compareDesc(new Date(a.publishedAt || '2000-01-01'), new Date(b.publishedAt || '2000-01-01'))
  );

  return (
    <main className="w-full min-h-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-8 md:py-12 lg:py-16 xl:py-24 max-w-4xl mx-auto">
      <div className="max-w-2xl mx-auto mt-40 md:mt-0">
        <FadeIn>
          <div className="flex flex-col gap-12">
            {articles.map((article) => (
              <article key={article._id} className="group">
                <Link href={article.url} className="block space-y-3">
                  <h2 className="text-xl font-medium group-hover:underline decoration-1 underline-offset-4">
                    {article.title}
                  </h2>
                  {article.summary && (
                    <p className="text-gray-600 leading-relaxed">{article.summary}</p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
