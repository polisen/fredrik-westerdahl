import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Front-end Experiments — Fredrik Westerdahl',
  description:
    'UI and interaction experiments: motion, layout, gooey effects, scroll-linked behavior.',
};

export default function FrontEndExperimentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
