import { RouteView } from "@/components/features/collector/route-view"

export default async function CollectorRoutePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <RouteView pickupId={id} />
}