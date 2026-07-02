import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/server/db";
import { requirePermission } from "@/features/auth";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PARCEL_STATUS_LABELS_MN } from "@/constants/parcel-statuses";
import {
  toggleUserStatus,
  changeUserRole,
  resetUserPassword,
  assignUserWarehouse,
} from "../actions";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Супер Админ",
  ADMIN: "Админ",
  WAREHOUSE_STAFF: "Агуулахын ажилтан",
  CUSTOMER: "Харилцагч",
  COURIER: "Курьер",
};

const ROLE_BADGE_CLASSES: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  ADMIN: "bg-blue-100 text-blue-700",
  WAREHOUSE_STAFF: "bg-amber-100 text-amber-700",
  CUSTOMER: "bg-green-100 text-green-700",
  COURIER: "bg-sky-100 text-sky-700",
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  DISABLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Идэвхтэй",
  DISABLED: "Хаагдсан",
};

const ALL_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "WAREHOUSE_STAFF",
  "CUSTOMER",
  "COURIER",
] as const;

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 py-3 border-b border-neutral-100 last:border-0">
      <dt className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest sm:w-40 shrink-0 pt-0.5">
        {label}
      </dt>
      <dd className="text-sm text-ink font-medium break-all">{value ?? "—"}</dd>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission("users.read");

  const { id } = await params;
  const { error } = await searchParams;

  const user = await db.user.findUnique({
    where: { id },
    include: {
      customerProfile: {
        include: {
          defaultBranch: true,
        },
      },
      staffProfile: {
        include: {
          warehouse: true,
          branch: true,
        },
      },
      addresses: true,
    },
  });

  if (!user) notFound();

  const isStaffRole = user.role === "ADMIN" || user.role === "WAREHOUSE_STAFF";
  const warehouses = isStaffRole
    ? await db.warehouse.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      })
    : [];

  const [recentParcels, recentAuditLogs] = await Promise.all([
    user.customerProfile
      ? db.parcel.findMany({
          where: { customerId: id, deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            publicCode: true,
            status: true,
            createdAt: true,
          },
        })
      : Promise.resolve([]),
    db.auditLog.findMany({
      where: { actorId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        ipAddress: true,
        createdAt: true,
      },
    }),
  ]);

  const displayName = user.name ?? user.email ?? user.phone ?? "Хэрэглэгч";
  const roleBadgeClass =
    ROLE_BADGE_CLASSES[user.role] ?? "bg-neutral-100 text-ink-3";
  const statusBadgeClass =
    STATUS_BADGE_CLASSES[user.status] ?? "bg-neutral-100 text-ink-3";

  // Server actions bound with the user id
  async function handleToggleStatus(formData: FormData) {
    "use server";
    const newStatus = formData.get("newStatus") as "ACTIVE" | "DISABLED";
    await toggleUserStatus(id, newStatus);
  }

  async function handleChangeRole(formData: FormData) {
    "use server";
    const role = formData.get("role") as string;
    await changeUserRole(id, role);
  }

  async function handleResetPassword(formData: FormData) {
    "use server";
    const { redirect } = await import("next/navigation");
    const newPassword = formData.get("newPassword") as string;
    const result = await resetUserPassword(id, newPassword);
    if (result.error) {
      redirect(`/dashboard/super-admin/users/${id}?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/super-admin/users"
              className="text-[13px] text-ink-3 hover:text-brand transition-colors"
            >
              Хэрэглэгчид
            </Link>
            <span className="text-ink-3 text-[13px]">/</span>
            <span className="text-[13px] text-ink truncate">{displayName}</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-black text-ink">{displayName}</h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${roleBadgeClass}`}
            >
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusBadgeClass}`}
            >
              {STATUS_LABELS[user.status] ?? user.status}
            </span>
          </div>
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      {/* ── Basic info card ────────────────────────────────────── */}
      <SectionCard title="Үндсэн мэдээлэл">
        <dl>
          <InfoRow label="Нэр" value={user.name} />
          <InfoRow label="Имэйл" value={user.email} />
          <InfoRow label="Утас" value={user.phone} />
          <InfoRow label="Роль" value={ROLE_LABELS[user.role] ?? user.role} />
          <InfoRow
            label="Статус"
            value={
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusBadgeClass}`}
              >
                {STATUS_LABELS[user.status] ?? user.status}
              </span>
            }
          />
          <InfoRow
            label="Сүүлд нэвтэрсэн"
            value={
              user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString("mn-MN")
                : null
            }
          />
          <InfoRow
            label="Бүртгэгдсэн"
            value={new Date(user.createdAt).toLocaleString("mn-MN")}
          />
        </dl>
      </SectionCard>

      {/* ── Customer profile card ──────────────────────────────── */}
      {user.customerProfile && (
        <SectionCard title="Харилцагчийн профайл">
          <dl>
            <InfoRow
              label="Харилцагчийн код"
              value={user.customerProfile.customerCode}
            />
            <InfoRow label="Тэмдэглэл" value={user.customerProfile.notes} />
            <InfoRow
              label="Үндсэн салбар"
              value={user.customerProfile.defaultBranch?.name}
            />
          </dl>
        </SectionCard>
      )}

      {/* ── Staff profile card ─────────────────────────────────── */}
      {(user.staffProfile || isStaffRole) && (
        <SectionCard title="Ажилтны профайл">
          <dl>
            <InfoRow
              label="Ажилтны код"
              value={user.staffProfile?.employeeCode}
            />
            <InfoRow label="Салбар" value={user.staffProfile?.branch?.name} />
          </dl>

          {/* One admin ↔ one warehouse. Assign, or prompt to add if none. */}
          <div className="pt-4 mt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                Агуулах
              </span>
              {user.staffProfile?.warehouse ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                  <span className="size-1.5 rounded-full bg-brand" />
                  {user.staffProfile.warehouse.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Оноогоогүй
                </span>
              )}
            </div>

            <form
              action={assignUserWarehouse.bind(null, user.id)}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <select
                name="warehouseId"
                defaultValue={user.staffProfile?.warehouseId ?? ""}
                className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              >
                <option value="">— Агуулах сонгох —</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors shrink-0"
              >
                {user.staffProfile?.warehouseId ? "Шинэчлэх" : "Агуулах нэмэх"}
              </button>
            </form>
            {warehouses.length === 0 && (
              <p className="mt-2 text-xs text-ink-3">
                Идэвхтэй агуулах алга.{" "}
                <Link
                  href="/dashboard/super-admin/warehouses/new"
                  className="text-brand font-semibold hover:underline"
                >
                  Агуулах үүсгэх →
                </Link>
              </p>
            )}
          </div>
        </SectionCard>
      )}

      {/* ── Recent parcels ─────────────────────────────────────── */}
      {user.customerProfile && (
        <SectionCard title="Сүүлийн 10 илгээмж">
          {recentParcels.length === 0 ? (
            <p className="text-sm text-ink-3 py-4">Илгээмж байхгүй.</p>
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                      Код
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                      Статус
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                      Огноо
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                    >
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-brand">
                        <Link
                          href={`/dashboard/super-admin/parcels/${parcel.id}`}
                          className="hover:underline"
                        >
                          {parcel.publicCode ?? parcel.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={parcel.status} />
                      </td>
                      <td className="px-5 py-3 text-xs text-ink-3">
                        {new Date(parcel.createdAt).toLocaleDateString("mn-MN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Recent audit logs ──────────────────────────────────── */}
      <SectionCard title="Сүүлийн 10 аудит лог">
        {recentAuditLogs.length === 0 ? (
          <p className="text-sm text-ink-3 py-4">Аудит лог байхгүй.</p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                    Үйлдэл
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                    Объект
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                    IP
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                    Огноо
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentAuditLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                  >
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-ink">
                      {log.action}
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-3">
                      {log.entityType}
                      {log.entityId ? (
                        <span className="ml-1 font-mono text-ink-3">
                          #{log.entityId.slice(0, 8)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-3 font-mono">
                      {log.ipAddress ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-3">
                      {new Date(log.createdAt).toLocaleString("mn-MN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* ── Actions ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
          <h2 className="text-[13px] font-semibold text-ink">Үйлдлүүд</h2>
        </div>
        <div className="p-5 space-y-6">
          {/* Toggle status */}
          <div>
            <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mb-2">
              Статус өөрчлөх
            </p>
            <form action={handleToggleStatus}>
              <input
                type="hidden"
                name="newStatus"
                value={user.status === "ACTIVE" ? "DISABLED" : "ACTIVE"}
              />
              <button
                type="submit"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  user.status === "ACTIVE"
                    ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                }`}
              >
                {user.status === "ACTIVE" ? "Хаах" : "Идэвхжүүлэх"}
              </button>
            </form>
          </div>

          {/* Change role */}
          <div>
            <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mb-2">
              Роль өөрчлөх
            </p>
            <form action={handleChangeRole} className="flex items-center gap-2">
              <select
                name="role"
                defaultValue={user.role}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r] ?? r}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
              >
                Хадгалах
              </button>
            </form>
          </div>

          {/* Reset password */}
          <div>
            <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mb-2">
              Нууц үг шинэчлэх
            </p>
            <form
              action={handleResetPassword}
              className="flex items-center gap-2"
            >
              <input
                type="password"
                name="newPassword"
                placeholder="Шинэ нууц үг (8+ тэмдэгт)"
                minLength={8}
                required
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand w-64"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
              >
                Шинэчлэх
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
