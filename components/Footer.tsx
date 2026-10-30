'use client'

/** Kept so unused chrome still typechecks. Not rendered on the CV surface. */
export function FooterLinks() {
  return null
}

export function MenuOverlayFooter(_props: { open: boolean }) {
  return null
}

export function Footer() {
  return (
    <footer
      data-beat="footer"
      className="px-6 pb-16 pt-4 sm:px-12 md:px-20"
    >
      <div className="flex max-w-[56rem] flex-col gap-1 text-2xl">
        <a
          href="/fredrik_westerdahl_cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline-offset-4 hover:underline"
        >
          Open CV as PDF
        </a>
        <a
          href="https://github.com/polisen"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline-offset-4 hover:underline"
        >
          github.com/polisen
        </a>
        <a
          href="mailto:fredrik@userland.xyz"
          className="text-black underline-offset-4 hover:underline"
        >
          fredrik@userland.xyz
        </a>
      </div>
    </footer>
  )
}
