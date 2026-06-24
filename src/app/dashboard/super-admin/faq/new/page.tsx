import Link from "next/link";
import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { firstParam } from "@/lib/pagination";
import { FaqForm } from "@/features/faq/FaqForm";
import { createFaq } from "@/features/faq/actions";

const BASE = "/dashboard/super-admin/faq";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.FAQ_CREATE);
  const error = firstParam((await searchParams).error);

  return (
    <section>
      <Link href={BASE} style={{ fontSize: 13 }}>
        ← Back to FAQ
      </Link>
      <h1>New FAQ</h1>
      <FaqForm action={createFaq} error={error} />
    </section>
  );
}
