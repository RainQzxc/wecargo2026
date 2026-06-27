import { requirePermission } from "@/features/auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { getSiteContent } from "@/features/content/dal";
import { resolveSiteContent, SITE_CONTENT_FIELDS } from "@/features/content/site-content";
import { updateSiteContent } from "@/features/content/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requirePermission(PERMISSIONS.CONTENT_READ);
  const { saved } = await searchParams;
  const current = resolveSiteContent(await getSiteContent());

  const groups = [...new Set(SITE_CONTENT_FIELDS.map((f) => f.group))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Контент</h1>
        <p className="mt-1 text-sm text-ink-3">
          Нүүр хуудасны текстийг хөгжүүлэгчгүйгээр засварлана. Хоосон үлдээвэл анхны утга руу буцна.
        </p>
      </div>

      {saved && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Хадгалагдлаа.
        </div>
      )}

      <form action={updateSiteContent} className="space-y-8">
        {groups.map((group) => (
          <section key={group} className="space-y-4">
            <h2 className="border-b border-neutral-200 pb-2 text-lg font-semibold text-ink">
              {group}
            </h2>
            <div className="grid gap-5">
              {SITE_CONTENT_FIELDS.filter((f) => f.group === group).map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-2">
                    {field.label}
                  </span>
                  {field.multiline ? (
                    <textarea
                      name={field.key}
                      defaultValue={current[field.key]}
                      rows={3}
                      className="w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.key}
                      defaultValue={current[field.key]}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}

        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          Хадгалах
        </button>
      </form>
    </div>
  );
}
