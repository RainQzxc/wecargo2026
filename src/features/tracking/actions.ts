"use server";

import { db } from "@/server/db";
import { normalizePhone } from "@/lib/phone";
import { normalizeTrackCode } from "@/lib/track-code";
import { PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";
import { parcelStageIndex } from "@/constants/tracking-stages";

export interface TrackResult {
  searched: boolean;
  found: boolean;
  query: string;
  displayCode?: string;
  status?: string;
  statusLabel?: string;
  stage?: number;
  lastMessage?: string | null;
  updatedAt?: string | null;
}

type ParcelHit = {
  publicCode: string;
  trackCodeOriginal: string | null;
  status: string;
  updatedAt: Date;
  events: { messageMn: string | null }[];
} | null;

function toResult(query: string, parcel: ParcelHit): TrackResult {
  if (!parcel) return { searched: true, found: false, query };
  return {
    searched: true,
    found: true,
    query,
    displayCode: parcel.trackCodeOriginal ?? parcel.publicCode.slice(-12).toUpperCase(),
    status: parcel.status,
    statusLabel: PARCEL_STATUS_LABELS_MN[parcel.status] ?? parcel.status,
    stage: parcelStageIndex(parcel.status),
    lastMessage: parcel.events[0]?.messageMn ?? null,
    updatedAt: parcel.updatedAt.toISOString(),
  };
}

/**
 * Public parcel lookup for the landing page / track page. No auth — anyone with
 * a track code or phone can see high-level status only (no internal notes).
 */
export async function trackParcel(
  _prev: TrackResult | null,
  formData: FormData,
): Promise<TrackResult> {
  const query = String(formData.get("q") ?? "").trim();
  const type = String(formData.get("type") ?? "trackcode");
  if (!query) return { searched: false, found: false, query: "" };

  const select = {
    publicCode: true,
    trackCodeOriginal: true,
    status: true,
    updatedAt: true,
    events: { orderBy: { createdAt: "desc" as const }, take: 1, select: { messageMn: true } },
  };

  try {
    if (type === "phone") {
      const phoneNormalized = normalizePhone(query);
      const parcel = await db.parcel.findFirst({
        where: { customerPhoneNormalized: phoneNormalized, deletedAt: null },
        orderBy: { updatedAt: "desc" },
        select,
      });
      return toResult(query, parcel);
    }

    const code = normalizeTrackCode(query);
    const parcel = await db.parcel.findFirst({
      where: {
        deletedAt: null,
        OR: [
          { trackCodeNormalized: code },
          { publicCode: query },
          { trackCodeOriginal: query },
        ],
      },
      orderBy: { updatedAt: "desc" },
      select,
    });
    return toResult(query, parcel);
  } catch (err) {
    console.error("[trackParcel] error:", err);
    return { searched: true, found: false, query };
  }
}
