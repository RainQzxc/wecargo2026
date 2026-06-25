import { PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";

type BadgeVariant = "gray" | "blue" | "yellow" | "brand" | "green" | "red" | "purple";

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  REGISTERED:           "gray",
  RECEIVED_AT_EREEN:    "blue",
  MEASURED:             "purple",
  PRICED:               "purple",
  UNIDENTIFIED:         "red",
  READY_FOR_LOADING:    "yellow",
  LOADED:               "yellow",
  DEPARTED_EREEN:       "yellow",
  IN_TRANSIT:           "yellow",
  ARRIVED_ULAANBAATAR:  "brand",
  SORTING:              "brand",
  READY_FOR_PICKUP:     "brand",
  DELIVERY_REQUESTED:   "blue",
  OUT_FOR_DELIVERY:     "blue",
  DELIVERED:            "green",
  STORAGE_REQUESTED:    "gray",
  ISSUE:                "red",
  CANCELLED:            "red",
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  gray:   "bg-neutral-100 text-ink-3",
  blue:   "bg-blue-50 text-blue-700",
  yellow: "bg-amber-50 text-amber-700",
  brand:  "bg-brand/10 text-brand",
  green:  "bg-green-50 text-green-700",
  red:    "bg-red-50 text-red-700",
  purple: "bg-purple-50 text-purple-700",
};

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANT[status] ?? "gray";
  const label = PARCEL_STATUS_LABELS_MN[status] ?? status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${VARIANT_CLASSES[variant]}`}>
      {label}
    </span>
  );
}

// Delivery status badge
const DELIVERY_VARIANT: Record<string, BadgeVariant> = {
  REQUESTED:       "gray",
  ASSIGNED:        "yellow",
  OUT_FOR_DELIVERY: "blue",
  DELIVERED:       "green",
  FAILED:          "red",
  RETURNED:        "red",
  CANCELLED:       "red",
};

const DELIVERY_LABELS: Record<string, string> = {
  REQUESTED:        "Хүсэлт",
  ASSIGNED:         "Томилсон",
  OUT_FOR_DELIVERY: "Явж байна",
  DELIVERED:        "Хүргэсэн",
  FAILED:           "Амжилтгүй",
  RETURNED:         "Буцаасан",
  CANCELLED:        "Цуцлагдсан",
};

export function DeliveryStatusBadge({ status }: { status: string }) {
  const variant = DELIVERY_VARIANT[status] ?? "gray";
  const label = DELIVERY_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${VARIANT_CLASSES[variant]}`}>
      {label}
    </span>
  );
}
