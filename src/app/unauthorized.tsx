import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Unauthorized() {
  return (
    <main style={{ padding: 40 }}>
      <h1>401 — Unauthorized</h1>
      <p>You must sign in to access this page.</p>
      <Link href={ROUTES.login}>Go to login</Link>
    </main>
  );
}
