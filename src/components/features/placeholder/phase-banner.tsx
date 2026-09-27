import { Construction } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PhaseBanner({
  title,
  description,
  phase,
}: {
  title: string
  description: string
  phase: string
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600">
              <Construction className="size-5" />
            </span>
            <Badge variant="secondary">{phase}</Badge>
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This surface is scaffolded and wired into mock data. The screen is
            being built in the next phase.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}