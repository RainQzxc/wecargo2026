import type { Warehouse } from "@prisma/client";

const FIELD: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, maxWidth: 420 };
const INPUT: React.CSSProperties = { padding: 6 };

/**
 * Shared create/edit form for a Warehouse. `action` is a server action bound to
 * create (new FormData) or update (id pre-bound). `defaults` pre-fills on edit.
 */
export function WarehouseForm({
  action,
  defaults,
  error,
}: {
  action: (formData: FormData) => void;
  defaults?: Warehouse | null;
  error?: string;
}) {
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error === "name" ? (
        <p style={{ color: "#c5221f", fontSize: 13 }}>Агуулахын нэрийг заавал бөглөнө үү.</p>
      ) : null}

      <label style={FIELD}>
        <span>Name *</span>
        <input name="name" defaultValue={defaults?.name ?? ""} required style={INPUT} />
      </label>

      <label style={FIELD}>
        <span>Type</span>
        <select name="type" defaultValue={defaults?.type ?? "OTHER"} style={INPUT}>
          <option value="EREEN">Эрээн (China)</option>
          <option value="ULAANBAATAR">Улаанбаатар (Mongolia)</option>
          <option value="OTHER">Бусад</option>
        </select>
      </label>

      <label style={FIELD}>
        <span>Phone</span>
        <input name="phone" defaultValue={defaults?.phone ?? ""} style={INPUT} />
      </label>

      <label style={FIELD}>
        <span>Address (MN)</span>
        <textarea name="addressMn" defaultValue={defaults?.addressMn ?? ""} rows={2} style={INPUT} />
      </label>

      <label style={FIELD}>
        <span>Address (CN)</span>
        <textarea name="addressCn" defaultValue={defaults?.addressCn ?? ""} rows={2} style={INPUT} />
      </label>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" name="isActive" defaultChecked={defaults?.isActive ?? true} />
        <span>Active</span>
      </label>

      <div>
        <button type="submit">{defaults ? "Save changes" : "Create warehouse"}</button>
      </div>
    </form>
  );
}
