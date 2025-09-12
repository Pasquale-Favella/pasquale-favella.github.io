import { cn } from "@/utils"
import * as React from "react"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "textarea textarea-bordered w-full min-h-16 field-sizing-content resize-vertical",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }