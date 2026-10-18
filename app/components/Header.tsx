"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      try {
        const token = await currentUser.getIdTokenResult();
        setIsAdmin(token.claims.admin === true);
      } catch {
        setIsAdmin(false);
      }
    });
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handlePostAd = () => {
    closeMenu();
    router.push(user ? "/post-ad" : "/login?redirect=/post-ad");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    closeMenu();

    try {
      await signOut(auth);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/15 hover:text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-gradient-to-r from-purple-800 to-pink-600 text-white shadow-md">
      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-3 sm:px-5">
        <Link href="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-pink-500 text-xl text-white shadow">
            ♥
          </span>
          <span>
            <span className="block text-lg font-extrabold leading-tight tracking-tight">
              Lanka <span className="text-purple-700">Meet</span>
            </span>
            <span className="block text-[10px] text-slate-500">
              Sri Lanka Personal Ads
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/" className={linkClass}>Home</Link>
          <Link href="/ads" className={linkClass}>Ads</Link>
          <Link href="/live-cam" className={linkClass}>
            <span className="mr-1 text-red-500">●</span> Live Cam
          </Link>
          {user && <Link href="/profile" className={linkClass}>My Profile</Link>}
          {isAdmin && <Link href="/admin" className={linkClass}>Admin</Link>}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={handlePostAd}
            className="rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-purple-800"
          >
            + Post Ad
          </button>

          {!authReady ? (
            <span className="px-3 py-2 text-sm text-slate-400">Loading...</span>
          ) : user ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold hover:bg-slate-50 disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border border-purple-200 px-4 py-2.5 text-sm font-bold text-purple-800 hover:bg-purple-50"
            >
              Login / Register
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/40 text-xl text-white hover:bg-white/10 md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/20 bg-purple-950 p-3 text-white shadow-lg md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            <Link href="/" onClick={closeMenu} className={linkClass}>🏠 Home</Link>
            <Link href="/ads" onClick={closeMenu} className={linkClass}>📂 Ads</Link>
            <Link href="/live-cam" onClick={closeMenu} className={linkClass}>📹 Live Cam</Link>
            {user && <Link href="/profile" onClick={closeMenu} className={linkClass}>👤 My Profile</Link>}
            {isAdmin && <Link href="/admin" onClick={closeMenu} className={linkClass}>🛡️ Admin Panel</Link>}

            <button
              type="button"
              onClick={handlePostAd}
              className="rounded-lg bg-purple-700 px-3 py-3 text-left font-bold text-white"
            >
              + Post Ad
            </button>

            {!authReady ? (
              <p className="px-3 py-2 text-sm text-slate-500">Checking login...</p>
            ) : user ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg border border-slate-200 px-3 py-3 text-left font-bold"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <Link href="/login" onClick={closeMenu} className="rounded-lg bg-purple-50 px-3 py-3 font-bold text-purple-800">
                🔐 Login / Register
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
