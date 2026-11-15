"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  runTransaction,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

type AdData = {
  id?: string;
  category?: string;
  title?: string;
  age?: number | string;
  district?: string;
  location?: string;
  about?: string;

  mobileNumber?: string;
  whatsappNumber?: string;

  photoUrl?: string;
  photo?: string;

  packageName?: string;

  views?: number;
  likes?: number;

  status?: string;
  adminApproved?: boolean;
  paymentStatus?: string;

  createdAt?: any;
};

export default function AdDetailsPage() {
  const params = useParams();

  const id =
    typeof params?.id === "string"
      ? params.id
      : "";

  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadAd = async () => {
      try {
        setLoading(true);
        setError("");

        const adRef = doc(db, "ads", id);
        const snapshot = await getDoc(adRef);

        if (!snapshot.exists()) {
          setError("Advertisement not found.");
          setLoading(false);
          return;
        }

        const data = snapshot.data() as AdData;

        // Only show ads that are approved by admin and fully paid.
        if (
          data.adminApproved !== true ||
          data.paymentStatus !== "paid"
        ) {
          setAd(null);
          setError("This advertisement is no longer available.");
          setLoading(false);
          return;
        }

        setAd({
          ...data,
          id: snapshot.id,
        });

          // Update views in the background without blocking the page.
          void fetch("/api/ad-view", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ adId: id }),

          })
            .then((viewResponse) => {
              if (viewResponse.ok) {
                setAd((previous) =>
                  previous
                    ? {
                        ...previous,
                        views: Number(previous.views || 0) + 1,
                      }
                    : previous
                );
              }
            })
            .catch((viewError) => {
              console.error("VIEW UPDATE ERROR:", viewError);
            });
      } catch (err) {
        console.error(
          "LOAD AD ERROR:",
          err
        );

        setError(
          "Unable to load this advertisement."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [id]);
  const handleLike = async () => {
    if (!id || liked) return;

    const user = auth.currentUser;

    if (!user) {
      setError("Please login to like this advertisement.");
      return;
    }

    try {
      const likeId = `${user.uid}_${id}`;
      const likeRef = doc(db, "likes", likeId);
      const adRef = doc(db, "ads", id);

      await runTransaction(db, async (transaction) => {
        const likeSnapshot = await transaction.get(likeRef);
        const adSnapshot = await transaction.get(adRef);

        if (likeSnapshot.exists()) {
          return;
        }

        if (!adSnapshot.exists()) {
          throw new Error("Advertisement not found.");
        }

        const currentLikes = Number(adSnapshot.data()?.likes || 0);

        transaction.set(likeRef, {
          userId: user.uid,
          adId: id,
          createdAt: new Date().toISOString(),
        });

        transaction.update(adRef, {
          likes: currentLikes + 1,
        });
      });

      setLiked(true);

      setAd((previous) =>
        previous
          ? {
              ...previous,
              likes: Number(previous.likes || 0) + 1,
            }
          : previous
      );
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !id) return;

    getDoc(doc(db, "savedAds", `${user.uid}_${id}`))
      .then((snapshot) => setSaved(snapshot.exists()))
      .catch((err) => console.error("SAVED AD LOAD ERROR:", err));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;

    const user = auth.currentUser;
    if (!user) {
      setError("Please login to save this advertisement.");
      return;
    }

    const savedRef = doc(db, "savedAds", `${user.uid}_${id}`);

    try {
      if (saved) {
        await deleteDoc(savedRef);
        setSaved(false);
      } else {
        await setDoc(savedRef, {
          userId: user.uid,
          adId: id,
          createdAt: new Date().toISOString(),
        });
        setSaved(true);
      }
    } catch (err) {
      console.error("SAVE AD ERROR:", err);
      setError("Unable to save this advertisement. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: ad?.title || "Lanka Meet Advertisement",
        text: "Check out this advertisement on Lanka Meet.",
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setError("Advertisement link copied.");
      }
    } catch (err) {
      if (err && typeof err === "object" && "name" in err && err.name === "AbortError") {
        return;
      }
      console.error("SHARE ERROR:", err);
      setError("Unable to share this advertisement.");
    }
  };

  const cleanPhoneNumber = (
    number: string
  ) => {
    return number.replace(/[^\d+]/g, "");
  };

  const whatsappNumber =
    ad?.whatsappNumber
      ? cleanPhoneNumber(ad.whatsappNumber)
      : "";

  const whatsappInternational =
    whatsappNumber.startsWith("0")
      ? "94" + whatsappNumber.substring(1)
      : whatsappNumber.replace("+", "");

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <header className="bg-purple-700 text-white shadow-lg">
          <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
            <Link
              href="/ads"
              className="font-bold"
            >
              ← Back to Ads
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading advertisement...
          </p>
        </div>
      </main>
    );
  }

  if (error || !ad) {
    return (
      <main className="min-h-screen bg-gray-100">
        <header className="bg-purple-700 text-white shadow-lg">
          <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
            <Link
              href="/"
              className="font-black"
            >
              💕 Lanka Meet
            </Link>

            <Link
              href="/ads"
              className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-purple-700"
            >
              Browse Ads
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl">
            😔
          </div>

          <h1 className="mt-4 text-xl font-black">
            Advertisement Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error ||
              "This advertisement is no longer available."}
          </p>

          <Link
            href="/ads"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-black text-white shadow-lg"
          >
            ← Browse Ads
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = ad.photoUrl || ad.photo || "";
  const packageName = (ad.packageName || "Normal").toLowerCase();

  const packageDesign =
    packageName === "vip"
      ? {
          name: "VIP",
          card: "border-red-300 bg-red-50",
          badge: "bg-red-600 text-white",
          accent: "text-red-700",
        }
      : packageName === "premium"
      ? {
          name: "Premium",
          card: "border-green-300 bg-green-50",
          badge: "bg-green-600 text-white",
          accent: "text-green-700",
        }
      : {
          name: "Normal",
          card: "border-blue-300 bg-blue-50",
          badge: "bg-blue-600 text-white",
          accent: "text-blue-700",
        };

  return (
    <main className="min-h-screen bg-slate-50 text-gray-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-purple-950 to-purple-800 text-white shadow-lg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">

          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg">
              💕
            </div>

            <div>
              <div className="text-lg font-extrabold">
                Lanka Meet
              </div>

              <div className="text-[9px] text-white/80">
                Sri Lanka Personal Ads
              </div>
            </div>
          </Link>

          <Link
            href="/ads"
            className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-purple-700"
          >
            Browse Ads
          </Link>

        </div>
      </header>

      {/* PAGE */}
      <section className="px-3 py-5 sm:px-4 sm:py-8">

        <div className="mx-auto max-w-2xl">

          {/* BACK */}
          <Link
            href="/ads"
            className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-purple-700"
          >
            ← Back to Ads
          </Link>

          {/* MAIN CARD */}
          <article className={`overflow-hidden rounded-3xl border-2 ${packageDesign.card} shadow-2xl shadow-purple-950/10`}>

            {/* PHOTO */}
            <div className="relative bg-gray-200">

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={ad.title || "Personal advertisement"}
                  className="block h-[420px] w-full object-cover sm:h-[620px]" onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="flex h-72 items-center justify-center bg-purple-50">
                  <div className="text-center">
                    <div className="text-5xl">
                      📷
                    </div>

                    <p className="mt-2 text-sm font-bold text-gray-400">
                      No photo available
                    </p>
                  </div>
                </div>
              )}

              {/* CATEGORY */}
              {ad.category && (
                <div className="absolute left-3 top-3 rounded-full bg-purple-700 px-3 py-1.5 text-[10px] font-black text-white shadow">
                  {ad.category}
                </div>
              )}

            </div>

            {/* CONTENT */}
            <div className="p-5 sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wide shadow ${packageDesign.badge}`}>
                  {packageDesign.name} Advertisement
                </span>
                <span className={`text-xs font-bold ${packageDesign.accent}`}>
                  LankaMeet
                </span>
              </div>

              {/* TITLE */}
              <div>
                <h1 className="text-2xl font-black leading-tight text-gray-900">
                  {ad.title ||
                    "Personal Advertisement"}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">

                  {ad.age && (
                    <span className="rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-bold text-purple-700">
                      🎂 {ad.age} Years
                    </span>
                  )}

                  {ad.district && (
                    <span className="rounded-full bg-pink-50 px-3 py-1.5 text-[10px] font-bold text-pink-700">
                      📍 {ad.district}
                    </span>
                  )}

                  {ad.location && (
                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-bold text-gray-600">
                      📌 {ad.location}
                    </span>
                  )}

                </div>
              </div>

              {/* STATS */}
              <div className="mt-5 flex items-center gap-5 border-y border-gray-100 py-4">

                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  👁️
                  <span>
                    {Number(ad.views || 0)}
                  </span>
                  <span className="font-normal">
                    Views
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  ❤️
                  <span>
                    {Number(ad.likes || 0)}
                  </span>
                  <span className="font-normal">
                    Likes
                  </span>
                </div>

              </div>

              {/* SAVE + SHARE */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-black text-white shadow-md transition hover:bg-gray-800 active:scale-[0.98]"
                >
                  {saved ? "♥ Saved" : "♡ Save"}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-black text-white shadow-md transition hover:bg-gray-800 active:scale-[0.98]"
                >
                  ↗ Share
                </button>
              </div>

              {/* ABOUT */}
              <div className="mt-6">

                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
                    📝
                  </div>

                  <h2 className="text-base font-black">
                    About This Ad
                  </h2>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">

                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                    {ad.about ||
                      "No description available."}
                  </p>

                </div>
              </div>

              {/* CONTACT */}
              <div className="mt-6">

                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-lg">
                    📞
                  </div>

                  <div>
                    <h2 className="text-base font-black">
                      Contact
                    </h2>

                    <p className="text-[10px] text-gray-500">
                      Contact this advertiser
                    </p>
                  </div>
                </div>

                <div className="space-y-3">

                  {/* MOBILE */}
                  {ad.mobileNumber && (
                    <a
                      href={`tel:${cleanPhoneNumber(
                        ad.mobileNumber
                      )}`}
                      className="flex items-center justify-between rounded-2xl border border-purple-100 bg-purple-50 p-4 transition active:scale-[0.98]"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-700 text-xl text-white shadow">
                          📱
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-gray-500">
                            Mobile Number
                          </p>

                          <p className="mt-0.5 text-sm font-black text-gray-900">
                            {ad.mobileNumber}
                          </p>
                        </div>

                      </div>

                      <div className="rounded-lg bg-purple-700 px-3 py-2 text-[10px] font-black text-white">
                        Call
                      </div>

                    </a>
                  )}

                  {/* WHATSAPP */}
                  {ad.whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappInternational}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-green-100 bg-green-50 p-4 transition active:scale-[0.98]"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500 text-xl text-white shadow">
                          🟢
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-gray-500">
                            WhatsApp Number
                          </p>

                          <p className="mt-0.5 text-sm font-black text-gray-900">
                            {ad.whatsappNumber}
                          </p>
                        </div>

                      </div>

                      <div className="rounded-lg bg-green-500 px-3 py-2 text-[10px] font-black text-white">
                        WhatsApp
                      </div>

                    </a>
                  )}

                  {!ad.mobileNumber &&
                    !ad.whatsappNumber && (
                      <div className="rounded-2xl bg-gray-50 p-4 text-center text-xs font-semibold text-gray-500">
                        Contact number not available.
                      </div>
                    )}

                </div>
              </div>

              {/* LIKE */}
              <button
                type="button"
                onClick={handleLike}
                disabled={liked}
                className={`mt-6 w-full rounded-2xl py-4 text-sm font-black shadow transition active:scale-[0.98] ${
                  liked
                    ? "bg-pink-100 text-pink-600"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                }`}
              >
                {liked
                  ? "❤️ Liked"
                  : "❤️ Like This Ad"}
              </button>

            </div>
          </article>

          {/* BOTTOM BACK */}
          <div className="py-6 text-center">

            <Link
              href="/ads"
              className="text-xs font-bold text-purple-700"
            >
              ← Browse More Advertisements
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
}
