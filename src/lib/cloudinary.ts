import "server-only";

import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary media helper. Reads credentials from env. CLOUDINARY_URL alone is
 * enough for the SDK, but we configure explicitly so missing vars fail loudly.
 *
 * Consumers: ParcelPhoto, Banner.imageUrl, Testimonial.avatarUrl.
 */

let configured = false;

function ensureConfigured(): void {
  if (configured) return;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary env vars missing (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET)",
    );
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  configured = true;
}

export interface UploadedImage {
  url: string; // secure HTTPS delivery URL
  publicId: string; // use to delete/transform later
  width: number;
  height: number;
  bytes: number;
  format: string;
}

export type UploadInput = Buffer | string; // Buffer, base64 data URI, or remote URL

/**
 * Upload an image to Cloudinary. `folder` namespaces assets (e.g. "parcels",
 * "banners", "testimonials"). Server-side only — never expose api_secret.
 */
export async function uploadImage(
  input: UploadInput,
  opts: { folder?: string; publicId?: string } = {},
): Promise<UploadedImage> {
  ensureConfigured();
  const payload =
    Buffer.isBuffer(input)
      ? `data:image/png;base64,${input.toString("base64")}`
      : input;

  const res = await cloudinary.uploader.upload(payload, {
    folder: opts.folder ? `wecargo/${opts.folder}` : "wecargo",
    public_id: opts.publicId,
    resource_type: "image",
    overwrite: true,
  });

  return {
    url: res.secure_url,
    publicId: res.public_id,
    width: res.width,
    height: res.height,
    bytes: res.bytes,
    format: res.format,
  };
}

/** Delete an asset by its publicId. No-op-safe: swallows "not found". */
export async function deleteImage(publicId: string): Promise<void> {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export interface SignedUploadParams {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Generate a signature for a browser direct-upload (file never touches our
 * server). Return these to the client; it POSTs the file + these params to
 * `https://api.cloudinary.com/v1_1/<cloudName>/image/upload`.
 */
export function signUploadParams(folder: string): SignedUploadParams {
  ensureConfigured();
  const timestamp = Math.round(Date.now() / 1000);
  const fullFolder = `wecargo/${folder}`;
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: fullFolder },
    process.env.CLOUDINARY_API_SECRET!,
  );
  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder: fullFolder,
  };
}
