"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

type LiveCamAd = {
  id: string;
  title?: string;
  about?: string;
  description?: string;
  category?: string;
  district?: string;
  location?: string;
  age?: number | string;
  photoUrl?: string;
  photo?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  videoCallAvailable?: boolean;
  adminApproved?: boolean;
  paymentStatus?: string;
  createdAt?: any;
};

function cleanPhoneNumber(value?: string) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function whatsappLink(value?: string) {
  let number = String(value || "").replace(/\D/g, "");

  if (number.startsWith("00")) {
    number = number.slice(2);
  }

  if (number.startsWith("0")) {
    number = "94" + number.slice(1);
  } else if (number.startsWith("94")) {
    // Already in Sri Lankan international format.
  }

  return number;
}

function createdAtMillis(value: any): number {
  if (value && typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

export default function LiveCam() {
  const [ads, setAds] = useState<LiveCamAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAds() {
      setLoading(true);
      setError("");

      try {
        const adsQuery = query(
          collection(db, "ads"),
          where("adminApproved", "==", true),
          where("paymentStatus", "==", "paid"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(adsQuery);

        const eligibleAds = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }) as LiveCamAd)
          .filter((ad) => ad.videoCallAvailable === true)
          .sort(
            (a, b) =>
              createdAtMillis(b.createdAt) -
              createdAtMillis(a.createdAt)
          );

        if (!cancelled) {
          setAds(eligibleAds);
        }
      } catch (loadError) {
        console.error("LOAD LIVE CAM ADS ERROR:", loadError);

        if (!cancelled) {
          setAds([]);
          setError(
            "We couldn't load the Live Cam list. Please try again shortly."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAds();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-8 sm:px-5 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-800 via-purple-700 to-pink-600 p-6 text-white shadow-lg sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-100">
            Lanka Meet
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            📹 Live Cam
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-50 sm:text-base">
            Browse advertisers who have chosen to be open to video calls.
            Contact them using the phone or WhatsApp details on their ad.
            Calls take place outside Lanka Meet.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/15 px-3 py-2">
              ✓ Advertiser opted in
            </span>
            <span className="rounded-full bg-white/15 px-3 py-2">
              ✓ Admin approved
            </span>
            <span className="rounded-full bg-white/15 px-3 py-2">
              ✓ Paid ads only
            </span>
          </div>
        </section>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Available advertisers
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Only approved, paid ads with video-call availability enabled appear here.
            </p>
          </div>

          {!loading && (
            <span className="rounded-full bg-purple-100 px-3 py-1.5 text-sm font-bold text-purple-800">
              {ads.length} {ads.length === 1 ? "ad" : "ads"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
            Loading available advertisers...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          >
            {error}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-2 font-bold underline"
            >
              Try again
            </button>
          </div>
        ) : ads.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
            <div className="text-4xl">📹</div>
            <h3 className="mt-4 text-lg font-extrabold text-slate-900">
              No available advertisers yet
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              There are no approved and paid ads with video-call availability
              enabled right now. Check back later, or browse all approved ads.
            </p>
            <Link
              href="/ads"
              className="mt-5 inline-flex rounded-xl bg-purple-700 px-5 py-3 text-sm font-bold text-white hover:bg-purple-800"
            >
              Browse all ads
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => {
              const mobile = cleanPhoneNumber(ad.mobileNumber);
              const whatsapp = whatsappLink(
                ad.whatsappNumber || ad.mobileNumber
              );
              const imageUrl = ad.photoUrl || ad.photo || "";

              return (
                <article
                  key={ad.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Link
                    href={`/ad/${ad.id}`}
                    className="block"
                    aria-label={`View ad ${ad.title || "details"}`}
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={ad.title || "Advertiser photo"}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          👤
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
                        ● Open to video calls
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-1 text-lg font-extrabold text-slate-900">
                        {ad.title || "Lanka Meet advertiser"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {[ad.category, ad.age ? `${ad.age} years` : "", ad.district || ad.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {(ad.about || ad.description) && (
                        <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {ad.about || ad.description}
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                    {mobile ? (
                      <a
                        href={`tel:${mobile}`}
                        className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
                      >
                        📞 Call
                      </a>
                    ) : (
                      <span className="flex items-center justify-center rounded-xl bg-slate-100 px-3 py-3 text-sm text-slate-400">
                        No phone
                      </span>
                    )}

                    {whatsapp ? (
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        WhatsApp
                      </a>
                    ) : (
                      <span className="flex items-center justify-center rounded-xl bg-slate-100 px-3 py-3 text-sm text-slate-400">
                        No WhatsApp
                      </span>
                    )}
                  </div>

                  <div className="border-t border-slate-100 px-4 py-3">
                    <Link
                      href={`/ad/${ad.id}`}
                      className="block text-center text-sm font-bold text-purple-700 hover:text-purple-900"
                    >
                      View full ad →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
