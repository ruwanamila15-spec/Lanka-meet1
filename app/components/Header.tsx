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
    "rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-white/15 hover:text-white";

  const mobileLinkClass =
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10";

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-gradient-to-r from-purple-800 via-purple-700 to-pink-600 text-white shadow-lg">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-3 sm:px-5">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-xl text-white shadow-sm">
            ♥
          </span>

          <span>
            <span className="block text-lg font-extrabold leading-tight tracking-tight sm:text-xl">
              Lanka Meet
            </span>
            <span className="block text-[10px] text-white/75 sm:text-[11px]">
              Sri Lanka Personal Ads
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          <Link href="/" onClick={closeMenu} className={linkClass}>
            Home
          </Link>
          <Link href="/categories" onClick={closeMenu} className={linkClass}>
            Categories
          </Link>
          <Link href="/login" onClick={closeMenu} className={linkClass}>
            Login / Register
          </Link>
          <Link
            href="/portal/how-to-post"
            onClick={closeMenu}
            className={linkClass}
          >
            How to Post Ads
          </Link>
          <Link href="/team" onClick={closeMenu} className={linkClass}>
            Team
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={handlePostAd}
            className="whitespace-nowrap rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-purple-800 shadow-sm transition hover:bg-purple-50"
          >
            + Post Ad
          </button>

          {!authReady ? (
            <span className="px-2 py-2 text-xs text-white/75">Loading...</span>
          ) : user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-xl border border-white/30 px-3 py-2 text-sm font-bold hover:bg-white/10"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="rounded-xl border border-white/30 px-3 py-2 text-sm font-bold hover:bg-white/10"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-xl border border-white/30 px-3 py-2 text-sm font-bold hover:bg-white/10 disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/30 text-2xl text-white transition hover:bg-white/10 lg:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/15 bg-purple-950 px-3 py-4 text-white shadow-xl lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1.5">
            <Link href="/" onClick={closeMenu} className={mobileLinkClass}>
              <span>🏠</span> Home
            </Link>

            <Link
              href="/categories"
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              <span>📂</span> Categories
            </Link>

            <Link
              href="/login"
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              <span>🔐</span> Login / Register
            </Link>

            <button
              type="button"
              onClick={handlePostAd}
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-3 text-left text-sm font-extrabold text-white shadow-sm"
            >
              <span>＋</span> Post Ad
            </button>

            <Link
              href="/portal/how-to-post"
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              <span>📝</span> How to Post Ads
            </Link>

            <Link href="/team" onClick={closeMenu} className={mobileLinkClass}>
              <span>💜</span> LankaMeet Team
            </Link>

            {!authReady ? (
              <p className="px-4 py-3 text-sm text-white/70">
                Checking login...
              </p>
            ) : user ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  <span>👤</span> My Profile
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    <span>🛡️</span> Admin Panel
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-xl border border-white/25 px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/10 disabled:opacity-50"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <p className="px-4 py-2 text-xs text-white/65">
                Login to access your profile and manage your advertisements.
              </p>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
