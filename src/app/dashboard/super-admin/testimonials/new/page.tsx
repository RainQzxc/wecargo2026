import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { firstParam } from "@/lib/pagination";
import { TestimonialForm } from "@/features/testimonials/TestimonialForm";
import { createTestimonial } from "@/features/testimonials/actions";

const BASE = "/dashboard/super-admin/testimonials";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.TESTIMONIALS_CREATE);
  const error = firstParam((await searchParams).error);

  return (
    <section>
      <Link href={BASE} style={{ fontSize: 13 }}>
        ← Back to testimonials
      </Link>
      <h1>New testimonial</h1>
      <TestimonialForm action={createTestimonial} error={error} />
    </section>
  );
}
