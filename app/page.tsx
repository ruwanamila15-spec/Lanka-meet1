"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import {
  collection,
  getDocs,

  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const categories = [
  "Vehicle Ads",
  "Home & Land",
  "Girls Personal",
  "Boys Personal",
  "Live Cam Service",
  "Spa",
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
            where("paymentStatus", "==", "paid")
          );

          const snapshot = await getDocs(q);

          const data: Ad[] = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          })) as Ad[];

          const packagePriority = (packageName?: string) => {
            const pkg = (packageName || "Normal").trim().toLowerCase();
            if (pkg === "subscription") return 1;
            if (pkg === "vip") return 2;
            if (pkg === "premium") return 3;
            return 4;
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

    const date = createdAt?.seconds
      ? new Date(createdAt.seconds * 1000)
      : new Date(createdAt);

    if (Number.isNaN(date.getTime())) return "";

    const diff = Math.max(0, Date.now() - date.getTime());
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;

    const years = Math.floor(days / 365);
    return `${years} years ago`;
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
    const pkg = (packageName || "Normal").trim().toLowerCase();

    if (pkg === "subscription") {
      return {
        name: "Subscription",
        border: "border-emerald-400",
        background: "bg-emerald-50",
        badge: "bg-gradient-to-r from-emerald-600 to-teal-500 text-white",
        text: "text-emerald-800",
        price: "text-emerald-800",
        icon: "♛",
      };
    }

    if (pkg === "vip") {
      return {
        name: "VIP",
        border: "border-amber-400",
        background: "bg-amber-50",
        badge: "bg-amber-500 text-white",
        text: "text-amber-800",
        price: "text-amber-800",
        icon: "♛",
      };
    }

    if (pkg === "premium") {
      return {
        name: "Premium",
        border: "border-purple-400",
        background: "bg-purple-50",
        badge: "bg-purple-700 text-white",
        text: "text-purple-800",
        price: "text-purple-800",
        icon: "★",
      };
    }

    return {
      name: "Normal",
      border: "border-blue-400",
      background: "bg-blue-50",
      badge: "bg-blue-700 text-white",
      text: "text-blue-800",
      price: "text-blue-800",
      icon: "♢",
    };
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
      <main className="min-h-screen bg-[#faf8ff] text-slate-900">
        {/* PREMIUM HERO */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#18072f] via-[#40106b] to-[#a51b91] text-white">
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-5 px-4 py-6 sm:px-6 md:grid-cols-[1fr_0.95fr] md:gap-8 md:py-9">
            <div className="relative z-10 text-center md:text-left">
              <span className="inline-flex rounded-full border border-pink-200/30 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-pink-100">
                ♥ Sri Lanka Personal Ads
              </span>
              <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                Find Your <span className="bg-gradient-to-r from-pink-200 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">Connection</span>
              </h1>
              <p className="mx-auto mt-2 max-w-md text-[11px] leading-5 text-purple-100 sm:text-sm md:mx-0">
                Discover advertisements and new connections across Sri Lanka.
              </p>

              <div className="mx-auto mt-4 flex h-10 max-w-md overflow-hidden rounded-full border border-white/50 bg-white p-1 shadow-xl md:mx-0">
                <span className="flex w-8 shrink-0 items-center justify-center text-lg text-purple-800">⌕</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = searchQuery.trim();
                      router.push(value ? "/ads?search=" + encodeURIComponent(value) : "/ads");
                    }
                  }}
                  placeholder="Search ads, category or district..."
                  className="min-w-0 flex-1 bg-transparent px-1.5 text-[10px] font-semibold text-slate-800 outline-none placeholder:text-slate-400 sm:text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const value = searchQuery.trim();
                    router.push(value ? "/ads?search=" + encodeURIComponent(value) : "/ads");
                  }}
                  className="rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 px-3 text-[9px] font-black text-white shadow transition hover:brightness-110"
                >
                  Search
                </button>
              </div>

              <div className="mt-4 flex justify-center gap-2 md:justify-start">
                <Link href="/ads" className="rounded-full bg-white px-4 py-2 text-[9px] font-black text-purple-950 shadow-lg transition hover:bg-pink-100">
                  Explore Ads →
                </Link>
                <button type="button" onClick={handlePostAd} className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[9px] font-black text-white backdrop-blur transition hover:bg-white/20">
                  + Post Your Ad
                </button>
              </div>
            </div>

            <div className="relative mx-auto h-[230px] w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-pink-400/30 to-purple-950 shadow-2xl shadow-black/30 sm:h-[300px] md:h-[350px]">
              <img
                src="/hero-model.webp"
                alt="LankaMeet featured adult model"
                className="h-full w-full object-cover object-center"
                fetchPriority="high"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-950/35 via-transparent to-transparent" />
              <span className="absolute bottom-3 right-3 rounded-full border border-white/30 bg-purple-950/60 px-3 py-1.5 text-[9px] font-black text-white backdrop-blur">
                ♥ Real People · Real Connections
              </span>
            </div>
          </div>
        </section>

        {/* ANIMATED ADVERTISING TICKER */}
        <section className="border-y border-fuchsia-300/30 bg-gradient-to-r from-[#260747] via-[#7410a0] to-[#31064f] py-2.5 text-white shadow-lg">
          <div className="lm-ad-marquee">
            <div className="lm-ad-marquee-track">
              <span>📢 SPECIAL OFFER: POST YOUR AD TODAY</span>
              <span>♛ VIP ADS · MORE VISIBILITY</span>
              <span>♥ CONNECT ACROSS SRI LANKA</span>
              <span>✨ DISCOVER NEW CONNECTIONS</span>
              <span>📍 COLOMBO · KANDY · GALLE · JAFFNA</span>
              <span>📢 SPECIAL OFFER: POST YOUR AD TODAY</span>
              <span>♛ VIP ADS · MORE VISIBILITY</span>
              <span>♥ CONNECT ACROSS SRI LANKA</span>
              <span>✨ DISCOVER NEW CONNECTIONS</span>
              <span>📍 COLOMBO · KANDY · GALLE · JAFFNA</span>
            </div>
          </div>
        </section>

        {/* COLOURFUL CATEGORY SLIDER */}
        <section id="categories" className="border-b border-purple-100 bg-white py-4 shadow-sm">
          <div className="mx-auto max-w-7xl px-3 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-purple-600">Browse LankaMeet</p>
                <h2 className="text-base font-black text-[#28113f] sm:text-lg">Explore Categories</h2>
              </div>
              <Link href="/ads" className="text-[9px] font-black text-purple-700 sm:text-xs">View All →</Link>
            </div>
            <div className="lm-category-slider flex gap-3 overflow-x-auto pb-3">
              {categories.map((category) => {
                const config: Record<string, {icon:string; style:string}> = {
                  "Vehicle Ads": {icon:"🚗", style:"from-blue-500 to-cyan-500"},
                  "Home & Land": {icon:"🏡", style:"from-emerald-500 to-teal-600"},
                  "Girls Personal": {icon:"👩", style:"from-pink-500 to-rose-600"},
                  "Boys Personal": {icon:"👨", style:"from-indigo-500 to-blue-700"},
                  "Live Cam Service": {icon:"🎥", style:"from-fuchsia-500 to-purple-700"},
                  "Spa": {icon:"🪷", style:"from-amber-400 to-orange-500"},
                };
                const item = config[category];
                return (
                  <Link
                    key={category}
                    href={"/ads?category=" + encodeURIComponent(category)}
                    className={"lm-category-card flex min-w-[118px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br " + item.style + " px-3 py-4 text-center text-white shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:min-w-[145px]"}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[10px] font-black leading-tight sm:text-xs">{category}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

                {/* ADVERTISEMENT COLLECTIONS */}
        <section className="bg-[#faf8ff] px-3 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-fuchsia-700 sm:text-[10px]">
                  The LankaMeet Collection
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-[#26113e] sm:text-3xl">
                  Latest Advertisements
                </h2>
                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                  {adsLoading ? "Discovering latest ads..." : ads.length + " approved advertisements"}
                </p>
              </div>
              <Link
                href="/ads"
                className="shrink-0 rounded-xl bg-[#35105f] px-4 py-2.5 text-[9px] font-black text-white shadow-lg transition hover:bg-purple-800 sm:text-xs"
              >
                View All →
              </Link>
            </div>

            {adsLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3 overflow-hidden rounded-2xl border border-purple-100 bg-white p-2.5">
                    <div className="h-32 w-28 shrink-0 animate-pulse rounded-xl bg-purple-100 sm:h-40 sm:w-40" />
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-purple-100" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-purple-50" />
                      <div className="h-3 w-full animate-pulse rounded bg-purple-50" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!adsLoading && ads.length === 0 && (
              <div className="rounded-3xl border border-dashed border-purple-200 bg-white px-5 py-16 text-center shadow-sm">
                <div className="text-5xl">✦</div>
                <h3 className="mt-4 text-lg font-black text-[#35105f]">No advertisements yet</h3>
                <p className="mt-2 text-xs text-slate-500">
                  Approved and paid advertisements will appear here.
                </p>
                <Link href="/ads" className="mt-5 inline-flex rounded-xl bg-purple-800 px-5 py-3 text-xs font-black text-white">
                  Explore Ads
                </Link>
              </div>
            )}

            {!adsLoading && ads.length > 0 && categories.map((category) => {
              const categoryAds = ads.filter((ad) => {
                const value = (ad.category || "").trim().toLowerCase();

                if (category === "Vehicle Ads") {
                  return value === "vehicle ads" || value === "vehicles" || value === "vehicle";
                }
                if (category === "Home & Land") {
                  return value === "home & land" || value === "home and land" || value === "property" || value === "land";
                }
                if (category === "Spa") {
                  return value === "spa" || value === "spa & massage";
                }
                if (category === "Live Cam Service") {
                  return value === "live cam service" || value === "live camera" || value === "live cam";
                }
                if (category === "Marriage Ads") {
                  return value === "marriage" || value === "marriage ads";
                }
                return value === category.toLowerCase();
              }).slice(0, 4);

              if (categoryAds.length === 0) return null;

              const label = category === "Live Cam Service" ? "Live Camera" : category;
              const icon =
                category === "Girls Personal" ? "👩" :
                category === "Boys Personal" ? "👨" :
                category === "Spa" ? "🪷" :
                category === "Friendship" ? "👫" :
                category === "Marriage Ads" ? "💍" :
                category === "Shemale" ? "✨" : "🎥";

              return (
                <section key={category} className="mb-10">
                  <div className="mb-4 flex items-end justify-between gap-2 border-b border-purple-100 pb-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-fuchsia-700">
                        Discover by category
                      </p>
                      <h3 className="mt-1 text-lg font-black text-[#28113f] sm:text-xl">
                        {icon} {label}
                      </h3>
                    </div>
                    <Link
                      href={"/ads?category=" + encodeURIComponent(category)}
                      className="shrink-0 rounded-full border border-purple-200 bg-white px-3.5 py-2 text-[9px] font-black text-purple-800 transition hover:bg-purple-800 hover:text-white sm:text-xs"
                    >
                      View All →
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {categoryAds.map((ad) => {
                      const design = getPackageDesign(ad.packageName);
                      const imageUrl = ad.photoUrl || ad.photo || "";
                      const price = Number(ad.price || 0);
                      const description = ad.about || ad.description || "";

                      return (
                        <Link
                          key={ad.id}
                          href={"/ad/" + ad.id}
                          className={
                            "group flex min-w-0 gap-3 overflow-hidden rounded-2xl border-2 " +
                            design.border + " " + design.background +
                            " p-2.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:gap-5 sm:p-3.5"
                          }
                        >
                          <div className="relative h-[142px] w-[112px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-50 sm:h-[180px] sm:w-[180px]">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={ad.title || "LankaMeet advertisement"}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center text-purple-300">
                                <span className="text-3xl">📷</span>
                                <span className="mt-1 text-[8px] font-bold">No photo</span>
                              </div>
                            )}
                            <span className={
                              "absolute left-1.5 top-1.5 rounded-md px-2 py-1 text-[8px] font-black shadow " +
                              design.badge
                            }>
                              {design.icon} {design.name}
                            </span>
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                            <div>
                              <h4 className="line-clamp-2 text-[12px] font-black leading-5 text-[#28113f] sm:text-base">
                                {ad.title || "Personal Advertisement"}
                              </h4>

                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {ad.age ? (
                                  <span className="rounded-full bg-white/80 px-2 py-1 text-[8px] font-bold text-purple-800">
                                    Age {ad.age}
                                  </span>
                                ) : null}
                                {ad.district || ad.location ? (
                                  <span className="max-w-full truncate rounded-full bg-white/80 px-2 py-1 text-[8px] font-bold text-slate-700">
                                    📍 {ad.district || ad.location}
                                  </span>
                                ) : null}
                                {ad.category ? (
                                  <span className="rounded-full bg-white/80 px-2 py-1 text-[8px] font-bold text-slate-600">
                                    {ad.category}
                                  </span>
                                ) : null}
                              </div>

                              {description && (
                                <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-slate-600 sm:text-xs sm:leading-5">
                                  {description}
                                </p>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-black/5 pt-2">
                              <span className="flex flex-wrap items-center gap-2 text-[8px] font-bold sm:text-[10px]">
                                <span className="text-blue-600">Views {Number(ad.views || 0)}</span>
                                <span className="text-blue-600">Like {Number(ad.likes || 0)}</span>
                                {ad.createdAt ? <span className="text-slate-500">{formatHomeTime(ad.createdAt)}</span> : null}
                              </span>
                              {price > 0 ? (
                                <span className={"text-[11px] font-black sm:text-sm " + design.price}>
                                  Rs. {price.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-[9px] font-black text-purple-800">
                                  View details →
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        {/* PUBLISH YOUR AD */}
        <section className="px-3 pb-10 sm:px-6 sm:pb-14">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#241044] via-[#57208a] to-[#9b278f] px-5 py-9 text-center text-white shadow-xl shadow-purple-900/15 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-pink-300/20 blur-3xl" />
            <div className="relative">
              <div className="text-3xl">✦</div>
              <h2 className="mt-3 text-xl font-black sm:text-2xl">Ready to Publish Your Ad?</h2>
              <p className="mx-auto mt-2 max-w-lg text-[10px] leading-5 text-purple-100 sm:text-sm">
                Share your advertisement with people across Sri Lanka on LankaMeet.
              </p>
              <button type="button" onClick={handlePostAd} className="mt-5 rounded-xl bg-white px-6 py-3 text-[10px] font-black text-purple-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-purple-50 sm:text-xs">
                + Publish Your Advertisement
              </button>
            </div>
          </div>
        </section>
      </main>
  );
}
