"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const categories = [
  "Girls Personal",
  "Boys Personal",
  "Spa",
  "Friendship",
  "Marriage Ads",
  "Live Cam Service",
];

type Ad = {
  id: string;
  title?: string;
  about?: string;
  description?: string;
  category?: string;
  district?: string;
  location?: string;
  age?: number;
  photoUrl?: string;
  photo?: string;
  packageName?: string;
  packageIconUrl?: string;
  packageImageUrl?: string;
  createdAt?: any;
  likes?: number;
  views?: number;
  price?: number;
  mobileNumber?: string;
  whatsappNumber?: string;
};




export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadLatestAds = async () => {
      try {
        setAdsLoading(true);

        const adsRef = collection(db, "ads");

          const q = query(
            adsRef,
            where("adminApproved", "==", true),
            where("paymentStatus", "==", "paid"),
            orderBy("createdAt", "desc")
          );

          const snapshot = await getDocs(q);

          const data: Ad[] = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          })) as Ad[];

          const packagePriority = (packageName?: string) => {
            const pkg = (packageName || "Normal").toLowerCase();
            if (pkg === "vip") return 1;
            if (pkg === "premium") return 2;
            return 3;
          };

          data.sort((a, b) => {
            const priorityDiff = packagePriority(a.packageName) - packagePriority(b.packageName);
            if (priorityDiff !== 0) return priorityDiff;

            const aTime = a.createdAt?.seconds
              ? a.createdAt.seconds * 1000
              : new Date(a.createdAt || 0).getTime();
            const bTime = b.createdAt?.seconds
              ? b.createdAt.seconds * 1000
              : new Date(b.createdAt || 0).getTime();

            return bTime - aTime;
          });

          setAds(data.slice(0, 3));

        setAds(data);
      } catch (error) {
        console.error("HOME LOAD ADS ERROR:", error);
        setAds([]);
      } finally {
        setAdsLoading(false);
      }
    };

    loadLatestAds();
  }, []);

  const formatHomeTime = (createdAt: any) => {
    if (!createdAt) return "";

    let date: Date;

    if (createdAt?.seconds) {
      date = new Date(createdAt.seconds * 1000);
    } else {
      date = new Date(createdAt);
    }

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";

    if (minutes < 60) {
      return `${minutes}min`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d`;
    }

    return date.toLocaleDateString();
  };


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
        console.error("HOME ADMIN CLAIM CHECK ERROR:", error);
        setIsAdmin(false);
      }
    });
  }, []);

  const getPackageDesign = (packageName?: string) => {
    const pkg = (packageName || "Normal").toLowerCase();

    if (pkg === "vip") {
      return {
        name: "VIP",
        border: "border-red-400",
        background: "bg-red-50",
        badge: "bg-red-600",
        text: "text-red-600",
        price: "text-red-600",
        ribbon: "bg-red-600",
        icon: "♛",
      };
    }

    if (pkg === "premium") {
      return {
        name: "Premium",
        border: "border-yellow-400",
        background: "bg-yellow-50",
        badge: "bg-yellow-500",
        text: "text-yellow-600",
        price: "text-yellow-600",
        ribbon: "bg-yellow-500",
        icon: "★",
      };
    }

    return {
      name: "Normal",
      border: "border-blue-400",
      background: "bg-blue-50",
      badge: "bg-blue-600",
      text: "text-blue-600",
      price: "text-blue-600",
      ribbon: "bg-blue-600",
      icon: "🛡️",
    };
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  const handlePostAd = () => {
    setMenuOpen(false);
    if (user) {
      router.push("/post-ad");
    } else {
      router.push("/login?redirect=/post-ad");
    }
  };
    return (
      <main className="min-h-screen bg-gray-100 text-gray-900">

        {/* HERO */}
        <section className="bg-gradient-to-r from-purple-700 to-pink-600">
          <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
            <div className="text-center text-white">
                <div className="mb-2 flex items-center justify-end gap-1.5">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        className="rounded-md bg-white/15 px-2.5 py-1 text-[9px] font-bold text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25 sm:px-3 sm:text-[10px]"
                      >
                        👤 Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-md bg-white px-2.5 py-1 text-[9px] font-bold text-purple-700 shadow-sm hover:bg-gray-100 sm:px-3 sm:text-[10px]"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="rounded-md bg-white/15 px-2.5 py-1 text-[9px] font-bold text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25 sm:px-3 sm:text-[10px]"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="rounded-md bg-white px-2.5 py-1 text-[9px] font-bold text-purple-700 shadow-sm hover:bg-gray-100 sm:px-3 sm:text-[10px]"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              <h1 className="text-lg font-black sm:text-xl">
                Find Your Connection ❤️
              </h1>

              <p className="mt-0.5 text-[9px] text-white/80">
                Browse personal ads across Sri Lanka
              </p>

              <div className="mx-auto mt-2 flex h-9 max-w-2xl overflow-hidden rounded-lg bg-white shadow">
                <div className="flex flex-1 items-center">
                  <span className="px-2 text-sm">🔍</span>
                  <input
                    type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search personal ads..."
                    className="min-w-0 flex-1 bg-transparent px-1 text-[10px] text-gray-800 outline-none"
                  />
                </div>

                  <button
                    type="button"
                    onClick={() => {
                      const value = searchQuery.trim();
                      router.push(value ? `/ads?search=${encodeURIComponent(value)}` : "/ads");
                    }}
                    className="flex items-center bg-purple-700 px-4 text-[10px] font-bold text-white hover:bg-purple-800"
                  >
                    Search
                  </button>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="categories" className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-3 py-2.5 sm:px-4">
            <div className="mb-1.5 text-[9px] font-black uppercase tracking-wide text-purple-700">
              Browse Categories
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {categories.map((category) => (
                <Link
                  key={category}
                  href="/ads"
                  className="whitespace-nowrap rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-[9px] font-bold text-purple-700"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST ADS */}
        <section className="bg-white px-3 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-6xl">

            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                  Latest Ads
                </div>

                <h2 className="mt-1 text-xl font-black">
                  Personal Ads
                </h2>
              </div>

              <Link
                href="/ads"
                className="text-[10px] font-bold text-purple-700"
              >
                View All →
              </Link>
            </div>

            {/* LOADING */}
            {adsLoading && (
              <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[180px] animate-pulse rounded-2xl border-2 border-gray-200 bg-gray-100 sm:h-[305px]"
                  />
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!adsLoading && ads.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-12 text-center">
                <div className="text-5xl">📭</div>

                <h2 className="mt-3 text-xl font-black text-slate-800">
                  No advertisements found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  No approved advertisements are available yet.
                </p>
              </div>
            )}

          {/* NEW AD CARDS */}
          {!adsLoading && ads.length > 0 && (
            <div className="space-y-5">
              {ads.map((ad) => {
                const design = getPackageDesign(ad.packageName);
                const mobile = String((ad as any).mobileNumber || "").trim();
                const whatsapp = String((ad as any).whatsappNumber || "").trim();
                const servicePrice = Number((ad as any).price || 0);
                const imageUrl = ad.photoUrl || "";

                return (
                  <article
                    key={ad.id}
                    onClick={() => { window.location.href = `/ad/${ad.id}`; }}
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 ${design.border} ${design.background} shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`}
                  >
                    <div className="grid grid-cols-[105px_minmax(0,1fr)] gap-2 p-2 sm:grid-cols-[300px_minmax(0,1fr)] sm:gap-5 sm:p-4">

                      {/* PHOTO */}
                      <div className="relative h-[165px] w-[105px] shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-[270px] sm:w-[300px]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Personal Advertisement"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                            <span className="text-5xl">📷</span>
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="line-clamp-2 font-black leading-tight tracking-tight text-slate-900 text-[16px] sm:text-[25px]">
                            {ad.title || "Personal Advertisement"}
                          </h2>

                          <span className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[7px] font-black uppercase text-white shadow ${design.badge}`}>
                            <span className="text-sm">{design.icon}</span>
                            {design.name}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {ad.district && (
                            <span className={`flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-[8px] font-bold sm:text-xs ${design.text}`}>
                              📍 {ad.district}
                            </span>
                          )}

                          {ad.category && (
                            <span className="flex items-center gap-1 rounded-lg border border-purple-100 bg-white px-2 py-1 text-[8px] font-bold text-purple-700 sm:text-xs">
                              ☷ {ad.category}
                            </span>
                          )}

                          <span className="flex items-center gap-1 rounded-lg border border-green-100 bg-green-50 px-2 py-1 text-[8px] font-bold text-green-700 sm:text-xs">
                            👁 {Number(ad.views || 0)} Views
                          </span>
                        </div>

                        {ad.location && (
                          <div className={`mt-2 text-[9px] font-bold sm:text-sm ${design.text}`}>
                            📍 {ad.location}
                          </div>
                        )}

                        {ad.about && (
                          <p className="mt-2 line-clamp-2 text-[9px] leading-relaxed text-slate-600 sm:text-sm">
                            {ad.about}
                          </p>
                        )}

                        <div className="mt-2 flex min-h-[34px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 sm:min-h-[45px] sm:px-4">
                          <span className="min-w-0 flex-1 truncate text-[8px] font-bold text-slate-600 sm:text-sm">
                            ◷ {formatHomeTime(ad.createdAt)}
                          </span>

                          <span className="flex shrink-0 items-center gap-1 rounded-lg px-1 py-1 text-[8px] font-bold text-slate-700 sm:px-2 sm:text-sm">
                            ♡ {Number(ad.likes || 0)} Likes
                          </span>

                          {servicePrice > 0 && (
                            <span className={`shrink-0 text-[15px] font-black sm:text-[22px] ${design.price}`}>
                              Rs. {servicePrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {(mobile || whatsapp) && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {mobile && (
                              <a
                                href={`tel:${mobile}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex h-8 min-w-0 items-center justify-center gap-1 overflow-hidden rounded-lg border-2 border-red-400 bg-white px-2 text-[8px] font-black text-red-600 transition hover:bg-red-50 sm:h-10 sm:text-sm"
                              >
                                <span className="text-lg">☎</span>
                                <span className="truncate">Call {mobile}</span>
                              </a>
                            )}

                            {whatsapp && (
                              <a
                                href={`https://wa.me/${whatsapp.replace(/^0/, "94").replace(/^\+/, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex h-8 min-w-0 items-center justify-center gap-1 overflow-hidden rounded-lg border-2 border-green-500 bg-white px-2 text-[8px] font-black text-green-600 transition hover:bg-green-50 sm:h-10 sm:text-sm"
                              >
                                <span className="text-lg">🟢</span>
                                <span className="truncate">WhatsApp</span>
                              </a>
                            )}
                          </div>
                        )}

                        <div className="mt-2">
                          <span className={`inline-block rounded-lg px-3 py-1.5 text-[9px] font-black text-white shadow ${design.badge}`}>
                            View Ad →
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

        {/* POST AD */}
        <section className="mx-auto max-w-6xl px-3 pb-5 sm:px-4">
          <div className="rounded-lg bg-gradient-to-r from-purple-700 to-pink-600 px-4 py-5 text-center text-white">

            <div className="text-2xl">
              📢
            </div>



              <h2 className="mt-1 text-base font-black">
                Want to Publish Your Own Ad?
              </h2>

              <p className="mt-1 text-[9px] text-white/80">
                Create your personal advertisement on Lanka Meet.
              </p>

              <Link
                href="/post-ad"
                className="mt-2.5 inline-block rounded-md bg-white px-4 py-2 text-[9px] font-bold text-purple-700 shadow"
              >
                Post Your Ad →
              </Link>

            </div>
          </section>

        </main>
  );
}
