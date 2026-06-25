/**
 * Public-facing tracking funnel — the many internal ParcelStatus values are
 * collapsed into 6 customer-friendly stages shown on the landing page / track
 * page timeline.
 */
export const TRACK_STAGES: { key: string; label: string }[] = [
  { key: "received", label: "Агуулахад хүлээн авсан" },
  { key: "transit", label: "Тээвэрлэгдэж байна" },
  { key: "arrived", label: "Улаанбаатарт ирсэн" },
  { key: "sorting", label: "Салбарт ирсэн" },
  { key: "ready", label: "Олгоход бэлэн" },
  { key: "delivered", label: "Хүргэгдсэн" },
];

export const TRACK_STAGE_COUNT = TRACK_STAGES.length;

/** Map a ParcelStatus to a 0-based stage index (0..5), or -1 for issue/cancel. */
export function parcelStageIndex(status: string): number {
  switch (status) {
    case "REGISTERED":
    case "RECEIVED_AT_EREEN":
    case "MEASURED":
    case "PRICED":
    case "UNIDENTIFIED":
      return 0;
    case "READY_FOR_LOADING":
    case "LOADED":
    case "DEPARTED_EREEN":
    case "IN_TRANSIT":
      return 1;
    case "ARRIVED_ULAANBAATAR":
      return 2;
    case "SORTING":
      return 3;
    case "READY_FOR_PICKUP":
    case "DELIVERY_REQUESTED":
    case "OUT_FOR_DELIVERY":
    case "STORAGE_REQUESTED":
      return 4;
    case "DELIVERED":
      return 5;
    default:
      return -1; // ISSUE / CANCELLED
  }
}
