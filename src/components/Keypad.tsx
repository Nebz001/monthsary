import { DeleteIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type KeypadProps = {
  disabled?: boolean
  onDigit: (digit: string) => void
  onClear: () => void
  onBackspace: () => void
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

// Row height comes from --key-h, set by the lock screen so the input matches.
const baseKey =
  "h-(--key-h) w-full touch-manipulation rounded-2xl font-hand focus-visible:ring-4 focus-visible:ring-ring/60"

const boxedKey = `${baseKey} border-border text-[clamp(1.6rem,4.6dvh,2.75rem)] font-medium focus-visible:border-ring`

// Clear and backspace: same tap size, no box. Hover and focus still show.
const flatKey = `${baseKey} border-transparent bg-transparent font-semibold text-foreground transition-transform hover:bg-transparent hover:text-blush active:scale-95 aria-expanded:bg-transparent dark:hover:bg-transparent`

export default function Keypad({
  disabled,
  onDigit,
  onClear,
  onBackspace,
}: KeypadProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-[min(1.6dvh,1rem)]">
      {DIGITS.map((digit) => (
        <Button
          key={digit}
          type="button"
          variant="secondary"
          className={boxedKey}
          disabled={disabled}
          onClick={() => onDigit(digit)}
        >
          {digit}
        </Button>
      ))}
      <Button
        type="button"
        variant="ghost"
        aria-label="Clear"
        className={`${flatKey} text-[clamp(1.1rem,3dvh,1.6rem)] hover:scale-105`}
        disabled={disabled}
        onClick={onClear}
      >
        Clear
      </Button>
      <Button
        type="button"
        variant="secondary"
        className={boxedKey}
        disabled={disabled}
        onClick={() => onDigit("0")}
      >
        0
      </Button>
      <Button
        type="button"
        variant="ghost"
        aria-label="Delete last digit"
        className={`${flatKey} text-blush hover:scale-105 hover:text-foreground`}
        disabled={disabled}
        onClick={onBackspace}
      >
        <DeleteIcon className="size-7" aria-hidden="true" />
      </Button>
    </div>
  )
}
