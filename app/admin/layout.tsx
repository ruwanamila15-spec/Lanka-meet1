"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult(true);

        if (tokenResult.claims.admin !== true) {
          router.replace("/");
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error("ADMIN CLAIM CHECK ERROR:", error);
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-lg">
          <div className="text-3xl">🔐</div>
          <p className="mt-2 font-bold text-gray-700">
            Checking admin access...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
