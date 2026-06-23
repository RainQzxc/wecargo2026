import { getCurrentUserPermissions } from "@/features/auth";
import { DASHBOARD_SECTIONS, type SectionKey } from "@/features/dashboard/features";

/**
 * Structural placeholder for a dashboard section. Renders the feature-map
 * metadata (title, description, available actions, audit actions) and indicates
 * which actions the current viewer is permitted to perform. No business logic
 * lives here — real pages will replace this with data + server actions.
 */
export async function DashboardPlaceholder({
  sectionKey,
  variant,
  detailId,
}: {
  sectionKey: SectionKey;
  variant?: "list" | "detail" | "new";
  detailId?: string;
}) {
  const section = DASHBOARD_SECTIONS[sectionKey];
  const granted = await getCurrentUserPermissions();
  const actions = Object.entries(section.actions);

  return (
    <section>
      <h1>{section.title}</h1>
      <p style={{ color: "#666" }}>{section.description}</p>

      {variant === "detail" && detailId ? (
        <p>
          Detail view — id: <code>{detailId}</code>
        </p>
      ) : null}
      {variant === "new" ? <p>Create new {section.title} record.</p> : null}

      {actions.length > 0 ? (
        <>
          <h2 style={{ fontSize: 14 }}>Actions (server-enforced permission)</h2>
          <ul>
            {actions.map(([name, permission]) => (
              <li key={permission}>
                {name} — <code>{permission}</code>{" "}
                {granted.includes(permission) ? "✅ allowed" : "🚫 denied"}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {section.auditActions.length > 0 ? (
        <>
          <h2 style={{ fontSize: 14 }}>Audit actions</h2>
          <p style={{ color: "#666", fontSize: 12 }}>{section.auditActions.join(", ")}</p>
        </>
      ) : null}

      <p style={{ marginTop: 24, color: "#999", fontSize: 12 }}>
        Placeholder — wire data + server actions next.
      </p>
    </section>
  );
}
