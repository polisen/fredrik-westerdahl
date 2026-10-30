import Link from 'next/link'
import { getNavItems, SITE } from '@/lib/entropy/content'

type SiteChromeProps = {
  currentHref: string
}

export function SiteChrome({ currentHref }: SiteChromeProps) {
  const items = getNavItems()

  return (
    <header className="border-b border-black/10 pb-8 pt-10 sm:pt-12">
      <div className="mx-auto w-full max-w-[68rem] px-4 text-left sm:px-6">
        <p className="site-title m-0 text-3xl font-bold sm:text-4xl">
          <Link href="/" className="text-black no-underline hover:text-black">
            {SITE.brand.toLowerCase()}
          </Link>
        </p>
        <p className="site-description mt-2 text-base text-black/55 sm:text-lg">
          {SITE.description}
        </p>

        <nav className="mt-6 sm:mt-8" aria-label="Primary">
          <ul className="m-0 flex list-none flex-wrap items-center justify-start gap-x-4 gap-y-2 p-0 text-base leading-snug sm:text-lg">
            {items.map((item) => {
              const isCurrent = item.href === currentHref
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={
                      isCurrent
                        ? 'text-black/40 no-underline'
                        : 'text-black underline-offset-4 hover:underline'
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
