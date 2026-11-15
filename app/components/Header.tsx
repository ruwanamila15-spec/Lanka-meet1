"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

const categories = [
  ["Girls Personal", "👩", "from-pink-500 to-rose-600"],
  ["Boys Personal", "👨", "from-blue-500 to-indigo-600"],
  ["Spa", "🌸", "from-fuchsia-500 to-purple-600"],
  ["Friendship", "👫", "from-emerald-500 to-teal-600"],
  ["Marriage Ads", "💍", "from-amber-400 to-orange-500"],
  ["Live Cam Service", "🎥", "from-orange-400 to-pink-500"],
];

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
    "whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold text-white/90 transition hover:bg-white/15 hover:text-white";

  const mobileLinkClass =
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10";

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#241044] via-[#572080] to-[#a52c91] text-white shadow-lg shadow-purple-950/20">
      <div className="mx-auto flex min-h-[70px] max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        <Link href="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/15 shadow-inner">
            <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden="true">
              <path d="M24 39S7 29 7 17.5C7 7 20 5 24 15c4-10 17-8 17 2.5C41 29 24 39 24 39Z" fill="#F9A8D4" />
              <path d="M16 23h7l3-7 5 15 3-8h3" stroke="#4C1D75" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            <span className="block text-xl font-black leading-none tracking-tight">
              Lanka<span className="text-pink-200">Meet</span>
            </span>
            <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.19em] text-purple-100">
              Connections Across Sri Lanka
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/" onClick={closeMenu} className={linkClass}>Home</Link>
          <Link href="/ads" onClick={closeMenu} className={linkClass}>All Ads</Link>
          <Link href="/categories" onClick={closeMenu} className={linkClass}>Categories</Link>
          <Link href="/portal/how-to-post" onClick={closeMenu} className={linkClass}>How to Post</Link>
          <Link href="/team" onClick={closeMenu} className={linkClass}>Team</Link>
          <Link href="/about" onClick={closeMenu} className={linkClass}>About</Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            type="button"
            onClick={handlePostAd}
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-purple-900 shadow-lg transition hover:-translate-y-0.5"
          >
            + Post Ad
          </button>

          {!authReady ? (
            <span className="text-xs text-purple-100">Loading...</span>
          ) : user ? (
            <>
              <Link href="/profile" className="rounded-lg border border-white/30 px-3 py-2 text-xs font-bold hover:bg-white/10">Profile</Link>
              {isAdmin && <Link href="/admin" className="rounded-lg border border-white/30 px-3 py-2 text-xs font-bold hover:bg-white/10">Admin</Link>}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg bg-black/20 px-3 py-2 text-xs font-bold hover:bg-black/30 disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg border border-white/50 px-3 py-2 text-xs font-bold hover:bg-white/10">Login</Link>
              <Link href="/register" className="rounded-lg bg-pink-200 px-3 py-2 text-xs font-black text-purple-950 hover:bg-white">Register</Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-xl font-bold text-white md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="max-h-[82vh] overflow-y-auto border-t border-white/15 bg-[#170b2b] px-3 pb-5 shadow-2xl md:hidden">
          <div className="mx-auto max-w-lg">
            <div className="relative mt-3 h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-950 shadow-xl">
              <img
                src="/menu-model.jpg"
                alt="LankaMeet featured model"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#160a2c]/90 via-purple-950/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-pink-200">Welcome to</p>
                <h2 className="mt-1 text-3xl font-black tracking-tight text-white">LankaMeet</h2>
                <p className="mt-1 text-[10px] font-semibold text-white/90">Discover connections across Sri Lanka</p>
              </div>
              <span className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/25 px-3 py-1 text-[9px] font-black tracking-wider text-white">✦ CONNECT</span>
            </div>

            <div className="mb-3 mt-5 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-300">Explore LankaMeet</p>
                <h3 className="mt-1 text-sm font-black text-white">Browse & Discover</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold text-purple-100">MENU</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link href="/" onClick={closeMenu} className="flex min-h-[58px] items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-r from-amber-400 to-orange-500 p-3 shadow-lg">
                <span className="text-2xl">🏠</span><span className="text-xs font-black text-white">Home</span>
              </Link>
              <Link href="/ads" onClick={closeMenu} className="flex min-h-[58px] items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-r from-cyan-500 to-blue-600 p-3 shadow-lg">
                <span className="text-2xl">📋</span><span className="text-xs font-black text-white">All Ads</span>
              </Link>

              {categories.map(([name, icon, color]) => (
                <Link
                  key={name}
                  href={`/ads?category=${encodeURIComponent(name)}`}
                  onClick={closeMenu}
                  className={`flex min-h-[58px] items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-r ${color} p-3 shadow-lg`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-black text-white">{name}</span>
                </Link>
              ))}

              <Link href="/live-cam" onClick={closeMenu} className="flex min-h-[58px] items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-r from-rose-500 to-red-600 p-3 shadow-lg">
                <span className="text-2xl">🎥</span><span className="text-xs font-black text-white">Live Cam</span>
              </Link>
              <Link href="/categories" onClick={closeMenu} className="flex min-h-[58px] items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-r from-violet-500 to-purple-700 p-3 shadow-lg">
                <span className="text-2xl">📂</span><span className="text-xs font-black text-white">All Categories</span>
              </Link>
              <Link href="/portal/how-to-post" onClick={closeMenu} className="flex min-h-[58px] items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-r from-sky-500 to-blue-700 p-3 shadow-lg">
                <span className="text-2xl">📝</span><span className="text-xs font-black text-white">How to Post</span>
              </Link>
              <Link href="/team" onClick={closeMenu} className="flex min-h-[58px] items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-r from-indigo-500 to-purple-800 p-3 shadow-lg">
                <span className="text-2xl">💜</span><span className="text-xs font-black text-white">Our Team</span>
              </Link>
              <Link href="/about" onClick={closeMenu} className="flex min-h-[58px] items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 shadow-lg">
                <span className="text-2xl">ℹ️</span><span className="text-xs font-black text-white">About Us</span>
              </Link>
            </div>

            {user && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/profile" onClick={closeMenu} className="rounded-xl border border-white/20 bg-gradient-to-r from-slate-600 to-slate-800 p-3 text-center text-xs font-black text-white">👤 Profile</Link>
                {isAdmin && <Link href="/admin" onClick={closeMenu} className="rounded-xl border border-white/20 bg-gradient-to-r from-violet-600 to-purple-800 p-3 text-center text-xs font-black text-white">🛡 Admin Panel</Link>}
              </div>
            )}

            <button onClick={handlePostAd} className="mt-3 w-full rounded-xl border border-white/30 bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 p-4 text-center text-sm font-black text-[#351044] shadow-xl">
              ＋ POST YOUR AD
              <span className="mt-1 block text-[9px] font-bold opacity-75">Share your advertisement with Sri Lanka</span>
            </button>

            {!authReady ? (
              <p className="mt-3 rounded-xl bg-white/10 p-3 text-center text-xs text-purple-200">Checking login...</p>
            ) : user ? (
              <button onClick={handleLogout} disabled={loggingOut} className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 p-3 text-xs font-bold text-white">
                {loggingOut ? "Logging out..." : "↪ Logout"}
              </button>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/login" onClick={closeMenu} className="rounded-xl border border-white/50 bg-white/10 p-3 text-center text-xs font-black text-white">Login</Link>
                <Link href="/register" onClick={closeMenu} className="rounded-xl bg-gradient-to-r from-pink-300 to-rose-300 p-3 text-center text-xs font-black text-purple-950 shadow-lg">Register</Link>
              </div>
            )}

            <p className="mt-4 text-center text-[9px] font-semibold tracking-wider text-white/40">LANKAMEET • CONNECTIONS ACROSS SRI LANKA</p>
          </div>
        </nav>
      )}
    </header>
  );
}
