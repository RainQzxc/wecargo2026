import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { can } from "@/features/auth/dal";
import { db } from "@/server/db";
import { firstParam } from "@/lib/pagination";
import { TestimonialForm } from "@/features/testimonials/TestimonialForm";
import { updateTestimonial, deleteTestimonial } from "@/features/testimonials/actions";

const BASE = "/dashboard/super-admin/testimonials";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.TESTIMONIALS_READ);
  const { id } = await params;
  const error = firstParam((await searchParams).error);

  const testimonial = await db.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  const canUpdate = await can(PERMISSIONS.TESTIMONIALS_UPDATE);
  const canDelete = await can(PERMISSIONS.TESTIMONIALS_DELETE);
  const update = updateTestimonial.bind(null, id);
  const remove = deleteTestimonial.bind(null, id);

  return (
    <section>
      <Link href={BASE} style={{ fontSize: 13 }}>
        ← Back to testimonials
      </Link>
      <h1>Edit testimonial</h1>

      {canUpdate ? (
        <TestimonialForm action={update} defaults={testimonial} error={error} />
      ) : (
        <p style={{ color: "#999" }}>You do not have permission to edit this testimonial.</p>
      )}

      {canDelete ? (
        <form action={remove} style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 16 }}>
          <button type="submit" style={{ color: "#c5221f" }}>
            Delete testimonial
          </button>
        </form>
      ) : null}
    </section>
  );
}
