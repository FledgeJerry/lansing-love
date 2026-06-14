"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Nav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const links = (
    <>
      <li><Link href="/governance" onClick={close}>Governance</Link></li>
      <li><Link href="/governance/charter" onClick={close}>Charter</Link></li>
      <li><Link href="/governance/issues" onClick={close}>Issues</Link></li>
      <li><Link href="/neighborhoods" onClick={close}>Neighborhoods</Link></li>
      <li><Link href="/boards" onClick={close}>Boards</Link></li>
      <li><Link href="/predictions" onClick={close}>Predictions</Link></li>
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
    <nav className="site-nav">
      <Link href="/" className="site-nav__logo">
        lansing<span>.</span>love
      </Link>

      <ul className="site-nav__links">
        {links}
      </ul>

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
  );
}
