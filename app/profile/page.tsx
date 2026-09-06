"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(
            doc(db, "users", currentUser.uid)
          );

          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfilePhoto(data.profilePhoto || "");
          }
        } catch (error) {
          console.log("Profile loading error:", error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "lanka meet");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/pdygqq3z/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Upload failed.");
      }

      const imageUrl = data.secure_url;

      await updateDoc(doc(db, "users", user.uid), {
        profilePhoto: imageUrl,
      });

      setProfilePhoto(imageUrl);
      setMessage("Profile photo updated successfully! 🎉");
    } catch (error: any) {
      console.log(error);
      setMessage(error?.message || "Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100">
        <p className="font-semibold text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="text-5xl">🔐</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Login Required
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please login to view your profile.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-bold text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 px-4 py-10">
      <div className="mx-auto max-w-md">

        <div className="mb-6 text-center">
          <div className="relative mx-auto h-28 w-28">

            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-5xl text-white shadow-lg">
                👤
              </div>
            )}

            <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-xl shadow-md">
              📷

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Your Lanka Meet account
          </p>

          {uploading && (
            <p className="mt-3 text-sm font-semibold text-purple-600">
              Uploading photo...
            </p>
          )}

          {message && (
            <p className="mt-3 rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
              {message}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">

          <div className="border-b border-gray-100 pb-5">
            <p className="text-xs font-semibold uppercase text-gray-400">
              Name
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {user.displayName || "Not added"}
            </p>
          </div>

          <div className="border-b border-gray-100 py-5">
            <p className="text-xs font-semibold uppercase text-gray-400">
              Email
            </p>

            <p className="mt-1 break-all text-base font-semibold text-gray-800">
              {user.email || "Not available"}
            </p>
          </div>

          <div className="border-b border-gray-100 py-5">
            <p className="text-xs font-semibold uppercase text-gray-400">
              Account Type
            </p>

            <p className="mt-1 text-base font-semibold text-gray-800">
              {user.providerData?.[0]?.providerId === "google.com"
                ? "Google Account"
                : "Email Account"}
            </p>
          </div>

          <div className="py-5">
            <p className="text-xs font-semibold uppercase text-gray-400">
              User ID
            </p>

            <p className="mt-1 break-all text-xs text-gray-500">
              {user.uid}
            </p>
          </div>

          <Link
            href="/"
            className="block w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3.5 text-center font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
