"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight text-rose-600">
          lansing.love
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-rose-600">Predictions</Link>
          <Link href="/leaderboard" className="hover:text-rose-600">Leaderboard</Link>
          <Link href="/about" className="hover:text-rose-600">About</Link>
          {session?.user.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-rose-600">Admin</Link>
          )}
          {(session?.user.role === "RESOLVER" || session?.user.role === "ADMIN") && (
            <Link href="/resolver" className="hover:text-rose-600">Resolve</Link>
          )}
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-gray-500 hover:text-gray-900"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:text-rose-600">Sign in</Link>
              <Link
                href="/register"
                className="bg-rose-600 text-white px-3 py-1 rounded hover:bg-rose-700"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
