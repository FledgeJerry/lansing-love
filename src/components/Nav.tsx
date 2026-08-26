"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Nav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const close = () => setOpen(false);

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function submitSearch() {
    if (searchQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  }

  const links = (
    <>
      <li><Link href="/" onClick={close}>Home</Link></li>
      <li><Link href="/history" onClick={close}>History</Link></li>
      <li><Link href="/governance/cases" onClick={close}>Cases</Link></li>
      <li><Link href="/governance/charter" onClick={close}>Charter</Link></li>
      <li><Link href="/governance" onClick={close}>Governance</Link></li>
      <li><Link href="/boards" onClick={close}>Boards</Link></li>
      <li><Link href="/neighborhoods" onClick={close}>Neighborhoods</Link></li>
      <li><Link href="/directory" onClick={close}>Co-op Directory</Link></li>
      <li><Link href="/patterns" onClick={close}>Patterns</Link></li>
      <li><Link href="/about" onClick={close}>About</Link></li>
      {session?.user.role === "ADMIN" && (
        <li><Link href="/admin" onClick={close}>Admin</Link></li>
      )}
      {session ? (
        <>
          <li><Link href="/profile" onClick={close}>Profile</Link></li>
          <li>
            <button onClick={() => { signOut(); close(); }} className="site-nav__signout">
              Sign out
            </button>
          </li>
        </>
      ) : (
        <>
          <li><Link href="/login" onClick={close}>Sign in</Link></li>
          <li>
            <Link href="/register" className="btn btn--primary btn--sm" onClick={close}>
              Join
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <>
      <nav className="site-nav">
        <ul className="site-nav__links">
          {links}
        </ul>

        <button
          aria-label="Search"
          onClick={openSearch}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-limestone, #F4F1E8)", padding: "0.3rem 0.5rem", lineHeight: 1, fontSize: "1.1rem", opacity: 0.7, flexShrink: 0 }}
        >
          🔍
        </button>

        <button
          className="site-nav__hamburger"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`hamburger-bar${open ? " open" : ""}`} />
          <span className={`hamburger-bar${open ? " open" : ""}`} />
          <span className={`hamburger-bar${open ? " open" : ""}`} />
        </button>

        {open && (
          <ul className="site-nav__drawer">
            {links}
          </ul>
        )}
      </nav>

      {searchOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSearchQ(""); } }}
          style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "5rem" }}
        >
          <form onSubmit={(e) => { e.preventDefault(); submitSearch(); }} style={{ width: "min(560px, 90vw)", display: "flex", gap: "0.5rem" }}>
            <input
              ref={searchRef}
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search cases, patterns, boards…"
              style={{ flex: 1, fontSize: "1rem", padding: "0.7rem 1rem" }}
              onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); setSearchQ(""); } }}
            />
            <button type="submit" className="btn btn--primary" style={{ flexShrink: 0 }}>Go</button>
          </form>
        </div>
      )}
    </>
  );
}
