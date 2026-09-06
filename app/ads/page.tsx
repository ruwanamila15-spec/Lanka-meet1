"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type Ad = {
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
  packageName?: string;
  packagePrice?: number | string;
  status?: string;
  paymentStatus?: string;
  adminApproved?: boolean;
  createdAt?: any;
  likes?: number;
  views?: number;
  mobileNumber?: string;
  whatsappNumber?: string;
};

const categories = [
  { name: "All Ads", icon: "☷" },
  { name: "Girls Personal", icon: "👩" },
  { name: "Boys Personal", icon: "👨" },
  { name: "Spa & Massage", icon: "🪷" },
  { name: "Marriage", icon: "💍" },
  { name: "Friendship", icon: "👫" },
];

const ADS_PER_PAGE = 30;

export default function AdsPage() {
  const router = useRouter();

  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [liking, setLiking] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    /* CATEGORY + SEARCH FROM URL */
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      setSelectedCategory(params.get("category") || "");
      setSearchTerm((params.get("search") || "").trim());
    }, []);

  /* LOAD APPROVED + PAID ADS */
  useEffect(() => {
    const loadAds = async () => {
      setLoading(true);

      try {
        const adsRef = collection(db, "ads");

        const q = query(
          adsRef,
          where("adminApproved", "==", true),
          where("paymentStatus", "==", "paid"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Ad[];

        setAds(data);
      } catch (error) {
        console.error("LOAD ADS ERROR:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, []);

  /* CATEGORY FILTER + PACKAGE PRIORITY */
  const filteredAds = useMemo(() => {
    let result = [...ads];

      if (searchTerm) {
        const search = searchTerm.toLowerCase();

        result = result.filter((ad) => {
          const searchableText = [
            ad.title,
            ad.about,
            ad.description,
            ad.category,
            ad.district,
            ad.location,
            ad.age,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(search);
        });
      }

    if (selectedCategory) {
      const selected = selectedCategory.toLowerCase();

      result = result.filter((ad) => {
        const category = (ad.category || "").toLowerCase();

        if (selected === "spa & massage") {
          return category === "spa" || category === "spa & massage";
        }

        if (selected === "marriage") {
          return category === "marriage" || category === "marriage ads";
        }

        return category === selected;
      });
    }

    result.sort((a, b) => {
      const priority: Record<string, number> = {
        vip: 1,
        premium: 2,
        normal: 3,
      };

      const aPriority =
        priority[(a.packageName || "Normal").toLowerCase()] || 3;

      const bPriority =
        priority[(b.packageName || "Normal").toLowerCase()] || 3;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      const aTime = a.createdAt?.seconds
        ? a.createdAt.seconds
        : new Date(a.createdAt || 0).getTime() / 1000;

      const bTime = b.createdAt?.seconds
        ? b.createdAt.seconds
        : new Date(b.createdAt || 0).getTime() / 1000;

      return bTime - aTime;
    });

    return result;
  }, [ads, selectedCategory, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAds.length / ADS_PER_PAGE)
  );

  const paginatedAds = filteredAds.slice(
    (currentPage - 1) * ADS_PER_PAGE,
    currentPage * ADS_PER_PAGE
  );

  /* RESET PAGE */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  /* TIME */
  const formatTime = (createdAt: any) => {
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
      return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days} days ago`;
    }

    return date.toLocaleDateString();
  };

  /* PHONE CLEAN */
  const cleanPhone = (number: string) => {
    return number.replace(/[^\d+]/g, "");
  };

  const whatsappNumber = (number: string) => {
    const clean = cleanPhone(number);

    if (clean.startsWith("0")) {
      return "94" + clean.substring(1);
    }

    if (clean.startsWith("+")) {
      return clean.substring(1);
    }

    return clean;
  };

  /* LIKE */
  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement>,
    ad: Ad
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (liking === ad.id) return;

    const user = auth.currentUser;

    if (!user) {
      alert("Please login to like this advertisement.");
      return;
    }

    try {
      setLiking(ad.id);

      const likeId = `${user.uid}_${ad.id}`;
      const likeRef = doc(db, "likes", likeId);
      const adRef = doc(db, "ads", ad.id);

      await runTransaction(db, async (transaction) => {
        const likeSnapshot = await transaction.get(likeRef);
        const adSnapshot = await transaction.get(adRef);

        if (likeSnapshot.exists()) return;

        if (!adSnapshot.exists()) {
          throw new Error("Advertisement not found.");
        }

        const currentLikes = Number(adSnapshot.data()?.likes || 0);

        transaction.set(likeRef, {
          userId: user.uid,
          adId: ad.id,
          createdAt: new Date().toISOString(),
        });

        transaction.update(adRef, {
          likes: currentLikes + 1,
        });
      });

      setAds((current) =>
        current.map((item) =>
          item.id === ad.id
            ? { ...item, likes: Number(item.likes || 0) + 1 }
            : item
        )
      );
    } catch (error) {
      console.error("LIKE ERROR:", error);
    } finally {
      setLiking("");
    }
  };

  /* OPEN AD */
  const openAd = (id: string) => {
    router.push(`/ad/${id}`);
  };

  /* PACKAGE DESIGN */
  const getPackageDesign = (packageName?: string) => {
    const pkg = (packageName || "Normal").toLowerCase();

    if (pkg === "vip") {
      return {
        name: "VIP",
        border: "border-red-400",
        background: "bg-red-50",
        softBackground: "bg-red-50",
        badge: "bg-red-600",
        text: "text-red-600",
        price: "text-red-600",
        ribbon: "bg-red-600",
        ribbonLight: "bg-red-500",
        icon: "♛",
      };
    }

    if (pkg === "premium") {
      return {
        name: "Premium",
        border: "border-yellow-400",
        background: "bg-yellow-50",
        softBackground: "bg-yellow-50",
        badge: "bg-yellow-500",
        text: "text-yellow-600",
        price: "text-yellow-600",
        ribbon: "bg-yellow-500",
        ribbonLight: "bg-yellow-400",
        icon: "★",
      };
    }

    return {
      name: "Normal",
      border: "border-blue-400",
      background: "bg-blue-50",
      softBackground: "bg-blue-50",
      badge: "bg-blue-600",
      text: "text-blue-600",
      price: "text-blue-600",
      ribbon: "bg-blue-600",
      ribbonLight: "bg-blue-500",
      icon: "♢",
    };
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
        {/* CATEGORY NAVIGATION */}
        <section className="border-b border-gray-200 bg-white px-3 py-2 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((category) => {
                const active =
                  category.name === "All Ads"
                    ? selectedCategory === ""
                    : selectedCategory.toLowerCase() === category.name.toLowerCase();

                const href =
                  category.name === "All Ads"
                    ? "/ads"
                    : `/ads?category=${encodeURIComponent(category.name)}`;

                return (
                  <Link
                    key={category.name}
                    href={href}
                      onClick={() => setSelectedCategory(category.name === "All Ads" ? "" : category.name)}
                    className={`flex h-8 shrink-0 items-center justify-center gap-1 rounded-md border px-2.5 text-[11px] font-extrabold transition-all sm:h-9 sm:px-3 sm:text-xs ${
                      active
                        ? "border-purple-900 bg-purple-900 text-white shadow-xl ring-2 ring-purple-300 scale-[1.02]"
                        : "border-gray-200 bg-gray-50 text-slate-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                  >
                    <span className="text-sm leading-none">{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

      {/* ADS */}
      <section className="bg-white px-2 py-2 sm:px-5 sm:py-4">
        <div className="mx-auto max-w-6xl">

          {loading && (
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[160px] animate-pulse rounded-lg border border-gray-200 bg-gray-100"
                />
              ))}
            </div>
          )}

          {!loading && filteredAds.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-14 text-center">
              <div className="text-5xl">📭</div>
              <h2 className="mt-3 text-lg font-black text-slate-800">
                No advertisements found
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                No approved advertisements are available in this category.
              </p>

              {selectedCategory && (
                <Link
                  href="/ads"
                  className="mt-4 inline-block rounded-lg bg-purple-700 px-4 py-2 text-xs font-bold text-white"
                >
                  View All Ads
                </Link>
              )}
            </div>
          )}

          {!loading && paginatedAds.length > 0 && (
            <div className="space-y-2">

              {paginatedAds.map((ad) => {
                const design = getPackageDesign(ad.packageName);
                const mobile = String(ad.mobileNumber || "").trim();
                const whatsapp = String(
                  ad.whatsappNumber || ad.mobileNumber || ""
                ).trim();
                const price = Number((ad as any).price || 0);
                const imageUrl = ad.photoUrl || ad.photo || "";

                return (
                    <article
                      key={ad.id}
                      onClick={() => openAd(ad.id)}
                      className={`relative cursor-pointer overflow-hidden rounded-xl border ${design.border} ${design.background} shadow-sm transition hover:shadow-md`}
                    >
                      <div className="flex min-h-[158px] gap-2 p-1.5 sm:min-h-[184px] sm:gap-3 sm:p-2">

                        {/* PHOTO */}
                        <div className="relative h-[145px] w-[108px] shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-[168px] sm:w-[205px]">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="Personal Advertisement"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400">
                              <div className="text-3xl">📷</div>
                              <div className="mt-1 text-[9px] font-bold">No photo</div>
                            </div>
                          )}

                          <span
                            className={`absolute left-1.5 top-1.5 rounded-md px-1 py-0.5 text-[5px] font-black text-white shadow sm:text-[7px] ${design.badge}`}
                          >
                            {design.name === "Premium" ? "Super Ad" : design.name === "VIP" ? "VIP Ad" : "Normal Ad"}
                          </span>
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="min-w-0 flex-1">

                          {/* TITLE */}
                          <h2 className="line-clamp-2 text-[14px] font-black leading-[17px] text-slate-900 sm:text-[18px] sm:leading-6">
                            {ad.title || "Personal Advertisement"}
                          </h2>

                          {/* CATEGORY + DISTRICT + VIEWS */}
                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            {ad.category && (
                              <span className="rounded-md border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[8px] font-extrabold text-purple-700 sm:px-2 sm:text-[11px]">
                                {ad.category}
                              </span>
                            )}

                            {ad.district && (
                              <span className={`rounded-md border bg-white px-1.5 py-0.5 text-[8px] font-extrabold ${design.text} sm:px-2 sm:text-[11px]`}>
                                📍 {ad.district}
                              </span>
                            )}

                            <span className="rounded-md border border-green-200 bg-green-50 px-1.5 py-0.5 text-[8px] font-extrabold text-green-700 sm:px-2 sm:text-[11px]">
                              👁 {Number(ad.views || 0)}
                            </span>
                          </div>

                          {/* LOCATION */}
                          {ad.location && (
                            <div className="mt-1 text-[9px] font-bold text-slate-600 sm:text-[12px]">
                              📍 {ad.location}
                            </div>
                          )}

                          {/* ABOUT */}
                          <div className="mt-1.5 rounded-md border border-gray-200 bg-white/90 px-2 py-1.5 sm:mt-2 sm:px-2.5 sm:py-2">
                            <div className="mb-0.5 text-[8px] font-black uppercase tracking-wide text-slate-500 sm:text-[10px]">
                              About
                            </div>
                            <p className="line-clamp-3 text-[10px] font-medium leading-[14px] text-slate-700 sm:text-[13px] sm:leading-[18px]">
                              {ad.about || ad.description || "Personal advertisement"}
                            </p>
                          </div>

                          {/* TIME + LIKE + PRICE */}
                          <div className="mt-1.5 flex min-h-[25px] items-center justify-between gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 sm:mt-2 sm:min-h-[32px] sm:px-2.5">
                            <span className="truncate text-[8px] font-bold text-slate-600 sm:text-[11px]">
                              ◷ {formatTime(ad.createdAt)}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => handleLike(e, ad)}
                              disabled={liking === ad.id}
                              className="shrink-0 rounded px-1 text-[8px] font-extrabold text-slate-700 hover:bg-gray-100 sm:text-[11px]"
                            >
                              ♡ {Number(ad.likes || 0)}
                            </button>

                            {price > 0 && (
                              <span className={`shrink-0 text-[13px] font-black sm:text-[17px] ${design.price}`}>
                                Rs. {price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* CONTACT BUTTONS */}
                          {(mobile || whatsapp) && (
                            <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:mt-2 sm:gap-2">
                              {mobile && (
                                <a
                                  href={`tel:${cleanPhone(mobile)}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex h-[28px] min-w-0 items-center justify-center overflow-hidden rounded-md border border-red-400 bg-white px-1.5 text-[8px] font-black text-red-600 hover:bg-red-50 sm:h-[34px] sm:px-2 sm:text-[11px]"
                                >
                                  ☎ Call
                                </a>
                              )}

                              {whatsapp && (
                                <a
                                  href={`https://wa.me/${whatsappNumber(whatsapp)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex h-[28px] min-w-0 items-center justify-center overflow-hidden rounded-md border border-green-500 bg-white px-1.5 text-[8px] font-black text-green-600 hover:bg-green-50 sm:h-[34px] sm:px-2 sm:text-[11px]"
                                >
                                  ◉ WhatsApp
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {/* PACKAGE RIBBON */}
                        <div className="hidden w-[62px] shrink-0 sm:block">
                          <div className={`rounded-md px-1.5 py-1.5 text-center text-[8px] font-black uppercase text-white shadow ${design.badge}`}>
                            {design.name}
                          </div>

                          <div
                            className={`mt-1 flex h-[116px] flex-col items-center justify-center text-white shadow ${design.ribbon}`}
                            style={{
                              clipPath: "polygon(0 0,100% 0,100% 87%,50% 100%,0 87%)",
                            }}
                          >
                            <div className="text-2xl leading-none">
                              {design.icon}
                            </div>

                            <div className="mt-1 text-[8px] font-black uppercase">
                              {design.name}
                            </div>
                          </div>
                        </div>

                      </div>
                    </article>
                  );
              })}

            </div>
          )}

          {/* PAGINATION */}
          {!loading && filteredAds.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-1.5">

              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="rounded-md bg-purple-700 px-3 py-1.5 text-[9px] font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.min(totalPages, currentPage + 2)
                )
                .map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[30px] rounded-md px-2 py-1.5 text-[9px] font-bold ${
                      page === currentPage
                        ? "bg-purple-700 text-white"
                        : "bg-white text-slate-800 shadow-sm ring-1 ring-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="rounded-md bg-white px-3 py-1.5 text-[9px] font-bold text-purple-700 shadow-sm ring-1 ring-purple-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>

            </div>
          )}

          {/* PACKAGE LEGEND */}
          {!loading && filteredAds.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">

              <div className="flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-[8px] font-bold text-red-600">
                <span className="text-xs">♛</span>
                <span>VIP</span>
              </div>

              <div className="flex items-center gap-1 rounded-md border border-yellow-200 bg-white px-2 py-1 text-[8px] font-bold text-yellow-600">
                <span className="text-xs">★</span>
                <span>Premium</span>
              </div>

              <div className="flex items-center gap-1 rounded-md border border-blue-200 bg-white px-2 py-1 text-[8px] font-bold text-blue-600">
                <span className="text-xs">♢</span>
                <span>Normal</span>
              </div>

            </div>
          )}

          {/* PRIVACY FOOTER STRIP */}
          <div className="mt-2 rounded-md bg-purple-50 px-2 py-1.5 text-center text-[8px] font-semibold text-purple-700">
            🔒 100% Safe &amp; Secure • Your Privacy Is Our Priority • LankaMeet
          </div>

        </div>
      </section>
    </main>
  );
}
