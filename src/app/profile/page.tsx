"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Outside Lansing", "Not sure"];
const AGE_RANGES = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65+", "Prefer not to say"];
const GENDERS = ["Man", "Woman", "Non-binary", "Self-describe", "Prefer not to say"];
const RACES = ["Black / African American", "White", "Hispanic / Latino", "Asian", "Native American", "Middle Eastern", "Multiracial", "Other", "Prefer not to say"];
const MEETINGS = ["Regularly (most meetings)", "Occasionally", "Never", "I watch online / on replay"];
const INTEREST_OPTIONS = ["Housing", "Zoning", "Budget", "Transit", "Public Safety", "Education", "Environment", "Elections", "Economic Development"];

type Profile = {
  name: string;
  email: string;
  neighborhood: string;
  ward: string;
  ageRange: string;
  gender: string;
  raceEthnicity: string;
  occupation: string;
  attendsMeetings: string;
  interests: string;
  emailSubscribed: boolean;
};

const EMPTY: Profile = {
  name: "", email: "", neighborhood: "", ward: "", ageRange: "",
  gender: "", raceEthnicity: "", occupation: "", attendsMeetings: "",
  interests: "", emailSubscribed: true,
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;
    fetch("/api/profile")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setProfile({ ...EMPTY, ...d }); setLoading(false); });
  }, [status, router]);

  function toggleMulti(field: "raceEthnicity" | "interests", value: string) {
    const current = profile[field] ? profile[field].split(",") : [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setProfile({ ...profile, [field]: updated.join(",") });
  }

  function isChecked(field: "raceEthnicity" | "interests", value: string) {
    return profile[field] ? profile[field].split(",").includes(value) : false;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (status === "loading" || loading) return null;

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Your Profile</h1>
      <p style={{ marginBottom: "2rem", color: "var(--color-text-muted)" }}>
        Help us understand who's predicting. All fields are optional.
      </p>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Account */}
        <section>
          <span className="eyebrow">Account</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Display name</label>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Email</label>
              <input value={profile.email} disabled style={{ opacity: 0.6 }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={profile.emailSubscribed}
                onChange={(e) => setProfile({ ...profile, emailSubscribed: e.target.checked })}
              />
              <span style={{ fontSize: "0.9rem" }}>Send me updates about new predictions</span>
            </label>
          </div>
        </section>

        {/* Location */}
        <section>
          <span className="eyebrow">Location</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Neighborhood</label>
              <input value={profile.neighborhood} onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })} placeholder="e.g. Old Town, South Side, REO Town…" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <label style={{ margin: 0 }}>Ward</label>
                <a
                  href="https://www.lansingmi.gov/180/Find-My-Ward"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.75rem", color: "var(--color-dome-gold)" }}
                >
                  Look up your ward →
                </a>
              </div>
              <select value={profile.ward} onChange={(e) => setProfile({ ...profile, ward: e.target.value })}>
                <option value="">Select…</option>
                {WARDS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Identity */}
        <section>
          <span className="eyebrow">About you</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Age range</label>
              <select value={profile.ageRange} onChange={(e) => setProfile({ ...profile, ageRange: e.target.value })}>
                <option value="">Select…</option>
                {AGE_RANGES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Gender</label>
              <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}>
                <option value="">Select…</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Race / Ethnicity <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>(select all that apply)</span></label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.4rem" }}>
                {RACES.map((r) => (
                  <label key={r} style={{ display: "flex", alignItems: "center", gap: "0.375rem", cursor: "pointer", fontSize: "0.875rem" }}>
                    <input type="checkbox" checked={isChecked("raceEthnicity", r)} onChange={() => toggleMulti("raceEthnicity", r)} />
                    {r}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Occupation</label>
              <input value={profile.occupation} onChange={(e) => setProfile({ ...profile, occupation: e.target.value })} placeholder="e.g. Teacher, Nurse, Student, Retired…" />
            </div>
          </div>
        </section>

        {/* Civic */}
        <section>
          <span className="eyebrow">Civic engagement</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Do you attend city council meetings?</label>
              <select value={profile.attendsMeetings} onChange={(e) => setProfile({ ...profile, attendsMeetings: e.target.value })}>
                <option value="">Select…</option>
                {MEETINGS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Interests <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>(select all that apply)</span></label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.4rem" }}>
                {INTEREST_OPTIONS.map((i) => (
                  <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.375rem", cursor: "pointer", fontSize: "0.875rem" }}>
                    <input type="checkbox" checked={isChecked("interests", i)} onChange={() => toggleMulti("interests", i)} />
                    {i}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button type="submit" disabled={saving} className="btn btn--primary">
            {saving ? "Saving…" : "Save profile"}
          </button>
          {saved && <span style={{ fontSize: "0.875rem", color: "var(--color-teal-accent)" }}>Saved!</span>}
        </div>
      </form>
    </div>
  );
}
