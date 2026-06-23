// Pricing calculations use TariffRule records fetched from DB.
// Never hardcode prices here.

export function calcVolumeM3(lengthCm: number, widthCm: number, heightCm: number): number {
  return (lengthCm * widthCm * heightCm) / 1_000_000;
}
