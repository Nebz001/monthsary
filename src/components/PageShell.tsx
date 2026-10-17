import type { ReactNode, Ref } from "react"

import FloatingDecor, { type DecorItem } from "@/components/FloatingDecor"

type PageShellProps = {
  decor: DecorItem[]
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}

// Wine background, flower corners, and floating decor shared by every page.
export default function PageShell({ decor, children, ref }: PageShellProps) {
  return (
    <div
      ref={ref}
      className="relative min-h-dvh w-full overflow-x-hidden bg-background"
    >
      <FloatingDecor items={decor} />
      {children}
    </div>
  )
}
