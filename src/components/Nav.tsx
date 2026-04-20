"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="site-nav">
      <Link href="/" className="site-nav__logo">
        lansing<span>.</span>love
      </Link>
      <ul className="site-nav__links">
        <li><Link href="/">Predictions</Link></li>
        <li><Link href="/leaderboard">Leaderboard</Link></li>
        <li><Link href="/about">About</Link></li>
        {session?.user.role === "ADMIN" && (
          <li><Link href="/admin">Admin</Link></li>
        )}
        {(session?.user.role === "RESOLVER" || session?.user.role === "ADMIN") && (
          <li><Link href="/resolver">Resolve</Link></li>
        )}
        {session && (
          <li><Link href="/profile">Profile</Link></li>
        )}
        {session ? (
          <li>
            <button
              onClick={() => signOut()}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "0.9rem", fontWeight: 500, fontFamily: "var(--font-sans)" }}
            >
              Sign out
            </button>
          </li>
        ) : (
          <>
            <li><Link href="/login">Sign in</Link></li>
            <li>
              <Link href="/register" className="btn btn--primary btn--sm">
                Join
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
