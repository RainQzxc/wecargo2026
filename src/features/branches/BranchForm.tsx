import type { Branch } from "@prisma/client";

const FIELD: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, maxWidth: 420 };
const INPUT: React.CSSProperties = { padding: 6 };

/** Shared create/edit form for a Branch. `action` is a bound server action. */
export function BranchForm({
  action,
  defaults,
  error,
}: {
  action: (formData: FormData) => void;
  defaults?: Branch | null;
  error?: string;
}) {
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error === "name" ? (
        <p style={{ color: "#c5221f", fontSize: 13 }}>Салбарын нэрийг заавал бөглөнө үү.</p>
      ) : null}

      <label style={FIELD}>
        <span>Name *</span>
        <input name="name" defaultValue={defaults?.name ?? ""} required style={INPUT} />
      </label>

      <label style={FIELD}>
        <span>Phone</span>
        <input name="phone" defaultValue={defaults?.phone ?? ""} style={INPUT} />
      </label>

      <label style={FIELD}>
        <span>Address</span>
        <textarea name="address" defaultValue={defaults?.address ?? ""} rows={2} style={INPUT} />
      </label>

      <div style={{ display: "flex", gap: 12 }}>
        <label style={{ ...FIELD, maxWidth: 200 }}>
          <span>City</span>
          <input name="city" defaultValue={defaults?.city ?? ""} style={INPUT} />
        </label>
        <label style={{ ...FIELD, maxWidth: 200 }}>
          <span>District</span>
          <input name="district" defaultValue={defaults?.district ?? ""} style={INPUT} />
        </label>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <label style={{ ...FIELD, maxWidth: 200 }}>
          <span>Latitude (map pin)</span>
          <input
            name="latitude"
            type="number"
            step="any"
            defaultValue={defaults?.latitude?.toString() ?? ""}
            style={INPUT}
          />
        </label>
        <label style={{ ...FIELD, maxWidth: 200 }}>
          <span>Longitude (map pin)</span>
          <input
            name="longitude"
            type="number"
            step="any"
            defaultValue={defaults?.longitude?.toString() ?? ""}
            style={INPUT}
          />
        </label>
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" name="isActive" defaultChecked={defaults?.isActive ?? true} />
        <span>Active</span>
      </label>

      <div>
        <button type="submit">{defaults ? "Save changes" : "Create branch"}</button>
      </div>
    </form>
  );
}
