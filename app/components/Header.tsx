"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      try {
        const tokenResult = await currentUser.getIdTokenResult(true);
        setIsAdmin(tokenResult.claims.admin === true);
      } catch (error) {
        console.error("HEADER ADMIN CLAIM CHECK ERROR:", error);
        setIsAdmin(false);
      }
    });
  }, []);

  const handlePostAd = () => {
    setMenuOpen(false);

    if (user) {
      router.push("/post-ad");
    } else {
      router.push("/login?redirect=/post-ad");
    }
  };

  return (
    <header className="bg-purple-700 text-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-0 sm:px-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-800 text-xl"
          >
            ☰
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg">
              💕
            </div>

            <div>
              <div className="text-base font-extrabold">Lanka Meet</div>
              <div className="text-[8px] text-white/75">
                Sri Lanka Personal Ads
              </div>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-lg bg-white px-4 py-2 text-[10px] font-bold text-purple-700"
          >
            🔐 Login / Register
          </Link>

          <button
            type="button"
            onClick={handlePostAd}
            className="rounded-lg bg-purple-900 px-4 py-2 text-[10px] font-bold text-white"
          >
            + Post Ad
          </button>
        </div>

        <button
          type="button"
          onClick={handlePostAd}
          className="rounded-lg bg-purple-900 px-3 py-2 text-[9px] font-bold text-white md:hidden"
        >
          + Ad
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-purple-500 bg-white text-gray-900 shadow-lg">
          <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4">
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">

              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700"
              >
                🔐 Login / Register
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                >
                  🛡️ Admin Panel
                </Link>
              )}

              <button
                type="button"
                onClick={handlePostAd}
                className="rounded-xl bg-purple-50 px-4 py-3 text-left text-sm font-bold text-purple-700"
              >
                ➕ Post an Ad
              </button>

              <Link
                href="/ads"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700"
              >
                📂 Categories / Ads
              </Link>

              <Link
                href="/portal/how-to-post"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700"
              >
                📝 How to Post an Ad
              </Link>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}
