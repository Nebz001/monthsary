import { ChevronLeftIcon } from "lucide-react"
import { Link } from "react-router-dom"

// Takes its own row at the top of the page, so content always starts below it. The row sits
// above the decor layer and clears phone notches. It stays in place at the top of the page
// and scrolls away with the content, so it never follows or covers the page while scrolling.
export default function BackLink({ to = "/" }: { to?: string }) {
  return (
    <div className="relative z-20 mb-12 w-fit pt-[calc(env(safe-area-inset-top)+0.5rem)] sm:mb-16">
      <Link
        to={to}
        className="inline-flex min-h-12 touch-manipulation items-center gap-1.5 rounded-full border border-blush-border bg-wine-soft py-2 pr-5 pl-3 font-hand text-xl font-semibold text-foreground shadow-[0_4px_14px_rgba(0,0,0,0.4)] outline-none transition-colors hover:bg-wine hover:text-blush active:scale-95 focus-visible:ring-4 focus-visible:ring-ring/60"
      >
        <ChevronLeftIcon className="size-6" aria-hidden="true" />
        Back to gifts
      </Link>
    </div>
  )
}
