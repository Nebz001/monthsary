import type { ReactNode, Ref } from "react"

import FloatingDecor, {
  type CornerName,
  type DecorItem,
} from "@/components/FloatingDecor"

type PageShellProps = {
  decor: DecorItem[]
  corners?: CornerName[]
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}

// Wine background, flower corners, and floating decor shared by every page.
// overflow-x-clip stops sideways scrolling without turning this box into a second scroll area.
export default function PageShell({
  decor,
  corners,
  children,
  ref,
}: PageShellProps) {
  return (
    <div
      ref={ref}
      className="relative min-h-dvh w-full overflow-x-clip bg-background"
    >
      <FloatingDecor items={decor} corners={corners} />
      {children}
    </div>
  )
}
