import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Forbidden() {
  return (
    <main style={{ padding: 40 }}>
      <h1>403 — Forbidden</h1>
      <p>You are signed in but lack permission to access this page.</p>
      <Link href={ROUTES.dashboard.root}>Back to dashboard</Link>
    </main>
  );
}
