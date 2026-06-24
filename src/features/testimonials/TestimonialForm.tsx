import type { Testimonial } from "@prisma/client";

const FIELD: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, maxWidth: 560 };
const INPUT: React.CSSProperties = { padding: 6 };

/** Shared create/edit form for a Testimonial. */
export function TestimonialForm({
  action,
  defaults,
  error,
}: {
  action: (formData: FormData) => void;
  defaults?: Testimonial | null;
  error?: string;
}) {
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error === "required" ? (
        <p style={{ color: "#c5221f", fontSize: 13 }}>Author name and quote (MN) are required.</p>
      ) : null}

      <div style={{ display: "flex", gap: 12 }}>
        <label style={{ ...FIELD, maxWidth: 280 }}>
          <span>Author name *</span>
          <input name="authorName" defaultValue={defaults?.authorName ?? ""} required style={INPUT} />
        </label>
        <label style={{ ...FIELD, maxWidth: 280 }}>
          <span>Author role / company</span>
          <input name="authorRole" defaultValue={defaults?.authorRole ?? ""} style={INPUT} />
        </label>
      </div>

      <label style={FIELD}>
        <span>Avatar URL</span>
        <input name="avatarUrl" defaultValue={defaults?.avatarUrl ?? ""} style={INPUT} />
      </label>

      <label style={FIELD}>
        <span>Quote (MN) *</span>
        <textarea name="quoteMn" defaultValue={defaults?.quoteMn ?? ""} rows={3} required style={INPUT} />
      </label>
      <label style={FIELD}>
        <span>Quote (EN)</span>
        <textarea name="quoteEn" defaultValue={defaults?.quoteEn ?? ""} rows={3} style={INPUT} />
      </label>

      <div style={{ display: "flex", gap: 12 }}>
        <label style={{ ...FIELD, maxWidth: 120 }}>
          <span>Rating (1-5)</span>
          <input name="rating" type="number" min={1} max={5} defaultValue={defaults?.rating ?? ""} style={INPUT} />
        </label>
        <label style={{ ...FIELD, maxWidth: 120 }}>
          <span>Sort order</span>
          <input name="sortOrder" type="number" defaultValue={defaults?.sortOrder ?? 0} style={INPUT} />
        </label>
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" name="isActive" defaultChecked={defaults?.isActive ?? true} />
        <span>Active (visible on site)</span>
      </label>

      <div>
        <button type="submit">{defaults ? "Save changes" : "Create testimonial"}</button>
      </div>
    </form>
  );
}
