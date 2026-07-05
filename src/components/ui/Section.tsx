import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Standard section shell: consistent rhythm, max-width, anchor offset. */
export function Section({
  id,
  className,
  children,
  wide = false,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 px-5 py-24 sm:px-8 md:py-32", className)}>
      <div className={cn("mx-auto", wide ? "max-w-7xl" : "max-w-6xl")}>{children}</div>
    </section>
  );
}
