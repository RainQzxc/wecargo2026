import type { Faq } from "@prisma/client";

const FIELD: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, maxWidth: 560 };
const INPUT: React.CSSProperties = { padding: 6 };

/** Shared create/edit form for an FAQ entry. */
export function FaqForm({
  action,
  defaults,
  error,
}: {
  action: (formData: FormData) => void;
  defaults?: Faq | null;
  error?: string;
}) {
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error === "required" ? (
        <p style={{ color: "#c5221f", fontSize: 13 }}>Question (MN) and Answer (MN) are required.</p>
      ) : null}

      <label style={FIELD}>
        <span>Question (MN) *</span>
        <input name="questionMn" defaultValue={defaults?.questionMn ?? ""} required style={INPUT} />
      </label>
      <label style={FIELD}>
        <span>Answer (MN) *</span>
        <textarea name="answerMn" defaultValue={defaults?.answerMn ?? ""} rows={3} required style={INPUT} />
      </label>
      <label style={FIELD}>
        <span>Question (EN)</span>
        <input name="questionEn" defaultValue={defaults?.questionEn ?? ""} style={INPUT} />
      </label>
      <label style={FIELD}>
        <span>Answer (EN)</span>
        <textarea name="answerEn" defaultValue={defaults?.answerEn ?? ""} rows={3} style={INPUT} />
      </label>

      <div style={{ display: "flex", gap: 12 }}>
        <label style={{ ...FIELD, maxWidth: 240 }}>
          <span>Category</span>
          <input name="category" defaultValue={defaults?.category ?? ""} style={INPUT} />
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
        <button type="submit">{defaults ? "Save changes" : "Create FAQ"}</button>
      </div>
    </form>
  );
}
