"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN" | "RESOLVER";
  createdAt: string;
  emailSubscribed: boolean;
  ward: string | null;
  ageRange: string | null;
  occupation: string | null;
  attendsMeetings: string | null;
  interests: string | null;
};

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") { router.push("/"); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") return;
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => { setUsers(d); setLoading(false); });
  }, [session]);

  async function setUserRole(id: string, role: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, role: updated.role } : u)));
    }
  }

  async function deleteUser(id: string, email: string) {
    if (!confirm(`Delete ${email}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers((us) => us.filter((u) => u.id !== id));
  }

  if (status === "loading" || loading) return <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Users</h1>
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>
          <Link href="/admin" style={{ color: "var(--color-steel-muted)" }}>← Admin</Link>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="ll-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: "var(--color-limestone)" }}>{u.name ?? "—"}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.emailSubscribed ? "badge--teal" : "badge--muted"}`}>
                      {u.emailSubscribed ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => setUserRole(u.id, e.target.value)}
                      disabled={u.id === session?.user.id}
                      style={{ width: "auto" }}
                    >
                      <option value="USER">User</option>
                      <option value="RESOLVER">Resolver</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td style={{ fontSize: "0.8rem" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.id !== session?.user.id && (
                      <button
                        onClick={() => deleteUser(u.id, u.email)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "0.8rem", fontFamily: "var(--font-sans)", padding: 0 }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DemographicReport users={users} />
      </div>
    </div>
  );
}

function DemographicReport({ users }: { users: User[] }) {
  function tally(key: keyof User) {
    const counts: Record<string, number> = {};
    for (const u of users) {
      const val = (u[key] as string | null) ?? "Not provided";
      counts[val] = (counts[val] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }

  const sections: { label: string; key: keyof User }[] = [
    { label: "Ward", key: "ward" },
    { label: "Age range", key: "ageRange" },
    { label: "Occupation", key: "occupation" },
    { label: "Attends meetings", key: "attendsMeetings" },
  ];

  const subscribed = users.filter((u) => u.emailSubscribed).length;

  return (
    <div className="card">
      <p style={{ fontWeight: 600, marginBottom: "1rem" }}>Demographics — {users.length} users</p>
      <p style={{ fontSize: "0.875rem", marginBottom: "1.25rem", color: "var(--color-text-muted)" }}>
        Email subscribers: <strong>{subscribed}</strong> of {users.length}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem" }}>
        {sections.map(({ label, key }) => (
          <div key={key}>
            <p style={{ fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{label}</p>
            {tally(key).map(([val, count]) => (
              <div key={val} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.2rem" }}>
                <span style={{ color: "var(--color-text-muted)" }}>{val}</span>
                <span style={{ fontWeight: 600 }}>{count}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
