export function upiProviderName(): string {
  return process.env.NEXT_PUBLIC_UPI_PROVIDER ?? "sandbox"
}

export function isUpiProviderConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_UPI_PROVIDER)
}

export function buildUpiDeepLink(
  upiId: string,
  amount: number,
  reference: string
): string {
  const name = encodeURIComponent("Coco")
  const note = encodeURIComponent(`Collector payout ${reference}`)
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${name}&am=${amount.toFixed(
    2
  )}&tn=${note}&cu=INR`
}