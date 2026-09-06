"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { createOrGetUserProfile } from "../lib/user";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

  const redirectTo = searchParams?.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const goAfterRegister = () => {
    router.push(redirectTo);
  };

  const registerWithGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await createOrGetUserProfile(result.user);

      setMessage("Google account created successfully!");

      setTimeout(() => {
        goAfterRegister();
      }, 500);
    } catch (err: any) {
      console.error("GOOGLE REGISTER ERROR:", err);

      if (err?.code === "auth/popup-closed-by-user") {
        setError("Google login was cancelled.");
      } else if (err?.code === "auth/popup-blocked") {
        setError("Please allow popups for this website.");
      } else if (
        err?.code === "auth/account-exists-with-different-credential"
      ) {
        setError(
          "An account already exists with this email using another login method."
        );
      } else {
        setError(err?.message || "Google registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(result.user, {
        displayName: name.trim(),
      });

      await createOrGetUserProfile(result.user);

      setMessage("Account created successfully!");

      setTimeout(() => {
        goAfterRegister();
      }, 700);
    } catch (err: any) {
      console.error("EMAIL REGISTER ERROR:", err);

      if (err?.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login.");
      } else if (err?.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err?.code === "auth/weak-password") {
        setError(
          "Password is too weak. Use at least 6 characters."
        );
      } else if (err?.code === "auth/operation-not-allowed") {
        setError(
          "Email/Password login is not enabled in Firebase."
        );
      } else {
        setError(err?.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 px-4 py-10">
      <div className="mx-auto max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-3xl shadow-lg">
            💕
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join Lanka Meet today
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={registerWithGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
          >
            <span className="text-xl font-bold">G</span>
            {loading ? "Please wait..." : "Continue with Google"}
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-semibold text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={registerWithEmail}>

            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:bg-gray-100"
            />

            <label className="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:bg-gray-100"
            />

            <label className="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:bg-gray-100"
            />

            <label className="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter password again"
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3.5 font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <div className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
            දැනටමත් account එකක් තියෙනවද?{" "}

            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="font-bold text-purple-600"
            >
              Login
            </Link>
          </div>

        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-500"
          >
            ← Back to Lanka Meet
          </Link>
        </div>

      </div>
    </main>
  );
}
