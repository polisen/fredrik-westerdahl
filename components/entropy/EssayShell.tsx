import Link from 'next/link'
import type { ReactNode } from 'react'
import { SiteChrome } from '@/components/entropy/SiteChrome'

type EssayShellProps = {
  children: ReactNode
  currentHref: string
}

export function EssayShell({ children, currentHref }: EssayShellProps) {
  return (
    <div className="min-h-full bg-white text-black">
      <SiteChrome currentHref={currentHref} />
      <div className="mx-auto w-full max-w-[68rem] px-4 py-10 sm:px-6 sm:py-14">
        <article>{children}</article>
        <footer className="mt-16 border-t border-black/10 pt-8">
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/55">
            <a
              href="https://github.com/polisen"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black hover:underline underline-offset-4"
            >
              GitHub
            </a>
            <a
              href="mailto:fredrik@userland.xyz"
              className="hover:text-black hover:underline underline-offset-4"
            >
              Email
            </a>
            <a
              href="/fredrik_westerdahl_cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black hover:underline underline-offset-4"
            >
              CV
            </a>
            <Link
              href="/"
              className="hover:text-black hover:underline underline-offset-4"
            >
              Home
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  )
}
