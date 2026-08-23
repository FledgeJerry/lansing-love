import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import EventForm from "../EventForm";

export default async function NewEventPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");
  return (
    <div>
      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/admin/history/events" style={{ color: "var(--color-steel-muted)" }}>Events</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        New
      </p>
      <h1 style={{ marginBottom: "2rem" }}>New Event</h1>
      <EventForm />
    </div>
  );
}
