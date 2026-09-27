import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Coco Mobile",
}

export default function MobilePwaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <div className="flex-1">{children}</div>
    </div>
  )
}