"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { createOrGetUserProfile } from "../lib/user";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

  const redirectTo = searchParams?.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const goAfterLogin = () => {
    router.push(redirectTo);
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

        console.log("GOOGLE AUTH SUCCESS:", result.user.uid);
        console.log("GOOGLE USER:", result.user.email);


      setMessage("Google login successful!");

      setTimeout(() => {
        goAfterLogin();
      }, 500);
    } catch (err: any) {
      console.error("GOOGLE LOGIN ERROR:", err);

      if (err?.code === "auth/popup-closed-by-user") {
        setError("Google login was cancelled.");
      } else if (err?.code === "auth/popup-blocked") {
        setError("Please allow popups for this website.");
      } else {
        setError(err?.message || "Google login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const userDoc = await getDoc(
        doc(db, "users", result.user.uid)
      );

      if (userDoc.exists() && userDoc.data()?.blocked === true) {
        await signOut(auth);
        setError("🚫 Your account has been blocked by the admin.");
        return;
      }

      await createOrGetUserProfile(result.user);

      setMessage("Login successful!");

      setTimeout(() => {
        goAfterLogin();
      }, 500);
    } catch (err: any) {
      console.error("EMAIL LOGIN ERROR:", err);

      if (err?.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err?.code === "auth/user-not-found") {
        setError("Account not found. Please register first.");
      } else if (err?.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err?.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err?.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:py-12">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-purple-700/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-pink-600/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
          <div className="w-full">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-3xl shadow-2xl shadow-purple-900/50">
                ❤️
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Sign in to continue to Lanka Meet
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:opacity-60"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26z"/>
                  <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.75z"/>
                  <path fill="#FBBC05" d="M6.53 13.83a5.86 5.86 0 0 1 0-3.66V7.64H3.29a9.75 9.75 0 0 0 0 8.72l3.24-2.53z"/>
                  <path fill="#EA4335" d="M12 6.14c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.21 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.39l3.24 2.53C7.3 7.86 9.46 6.14 12 6.14z"/>
                </svg>
                {loading ? "Please wait..." : "Continue with Google"}
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={loginWithEmail}>
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-600">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 disabled:bg-slate-100"
                />

                <label className="mb-2 mt-5 block text-xs font-black uppercase tracking-wide text-slate-600">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 disabled:bg-slate-100"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                Account එකක් නැද්ද?{" "}
                <Link
                  href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
                  className="font-black text-purple-600 hover:text-pink-600"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/"
                className="text-sm font-semibold text-slate-400 transition hover:text-white"
              >
                ← Back to Lanka Meet
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
}
