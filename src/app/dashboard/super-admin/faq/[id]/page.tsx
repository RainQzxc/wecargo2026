import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { can } from "@/features/auth/dal";
import { db } from "@/server/db";
import { firstParam } from "@/lib/pagination";
import { FaqForm } from "@/features/faq/FaqForm";
import { updateFaq, deleteFaq } from "@/features/faq/actions";

const BASE = "/dashboard/super-admin/faq";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.FAQ_READ);
  const { id } = await params;
  const error = firstParam((await searchParams).error);

  const faq = await db.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  const canUpdate = await can(PERMISSIONS.FAQ_UPDATE);
  const canDelete = await can(PERMISSIONS.FAQ_DELETE);
  const update = updateFaq.bind(null, id);
  const remove = deleteFaq.bind(null, id);

  return (
    <section>
      <Link href={BASE} style={{ fontSize: 13 }}>
        ← Back to FAQ
      </Link>
      <h1>Edit FAQ</h1>

      {canUpdate ? (
        <FaqForm action={update} defaults={faq} error={error} />
      ) : (
        <p style={{ color: "#999" }}>You do not have permission to edit this FAQ.</p>
      )}

      {canDelete ? (
        <form action={remove} style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 16 }}>
          <button type="submit" style={{ color: "#c5221f" }}>
            Delete FAQ
          </button>
        </form>
      ) : null}
    </section>
  );
}
