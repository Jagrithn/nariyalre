import type { PickupStatus } from "@/lib/types"
import { Badge, type BadgeProps } from "@/components/ui/badge"

const STATUS_MAP: Record<
  PickupStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  pending: { label: "Pending", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  in_transit: { label: "In transit", variant: "secondary" },
  weighed_in: { label: "Weighed in", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
}

export function PickupStatusBadge({ status }: { status: PickupStatus }) {
  const meta = STATUS_MAP[status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}