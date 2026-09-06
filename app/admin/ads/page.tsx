"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
    getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type Ad = {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  district?: string;
  location?: string;
  age?: number | string;
  photo?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  userId?: string;
  userEmail?: string;
  ownerUid?: string;
  status?: string;
  paymentStatus?: string;
  adminApproved?: boolean;
  packageName?: string;
  packagePrice?: number;
  paymentId?: string;
};

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [message, setMessage] = useState("");

    const loadAds = async () => {
      try {
        setLoading(true);

        const snapshot = await getDocs(collection(db, "ads"));

        const list: Ad[] = await Promise.all(
          snapshot.docs.map(async (item) => {
            const data = item.data() as Omit<Ad, "id">;
            const ownerUid = data.userId || data.ownerUid || "";
            let userEmail = "";

            if (ownerUid) {
              try {
                const userSnap = await getDoc(doc(db, "users", ownerUid));
                if (userSnap.exists()) {
                  userEmail = userSnap.data()?.email || "";
                }
              } catch (userError) {
                console.error("ADMIN USER LOAD ERROR:", userError);
              }
            }

            return {
              id: item.id,
              ...data,
              userEmail,
            };
          })
        );

        list.sort((a, b) => a.title?.localeCompare(b.title || "") || 0);
        setAds(list);
      } catch (error) {
        console.error("ADMIN ADS LOAD ERROR:", error);
        setMessage("Unable to load ads.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAds();
  }, []);

  const approveAd = async (ad: Ad) => {
    if (!confirm("Approve this advertisement?")) return;

    try {
      setActionId(ad.id);
      setMessage("");

      await updateDoc(doc(db, "ads", ad.id), {
        status: "published",
        paymentStatus: "paid",
        adminApproved: true,
      });

      setMessage("✅ Advertisement approved and published.");
      await loadAds();
    } catch (error) {
      console.error("APPROVE AD ERROR:", error);
      setMessage("❌ Failed to approve advertisement.");
    } finally {
      setActionId("");
    }
  };

  const rejectAd = async (ad: Ad) => {
    if (!confirm("Reject this advertisement?")) return;

    try {
      setActionId(ad.id);
      setMessage("");

      await updateDoc(doc(db, "ads", ad.id), {
        status: "rejected",
        adminApproved: false,
      });

      setMessage("Advertisement rejected.");
      await loadAds();
    } catch (error) {
      console.error("REJECT AD ERROR:", error);
      setMessage("❌ Failed to reject advertisement.");
    } finally {
      setActionId("");
    }
  };

  const deleteAd = async (ad: Ad) => {
    if (!confirm("Delete this advertisement permanently?")) return;

    try {
      setActionId(ad.id);
      setMessage("");

      await deleteDoc(doc(db, "ads", ad.id));

      setMessage("Advertisement deleted.");
      await loadAds();
    } catch (error) {
      console.error("DELETE AD ERROR:", error);
      setMessage("❌ Failed to delete advertisement.");
    } finally {
      setActionId("");
    }
  };

  const filteredAds = ads.filter((ad) => {
    if (filter === "pending") {
      return !ad.adminApproved && ad.status !== "rejected";
    }

    if (filter === "published") {
      return ad.adminApproved === true;
    }

    if (filter === "rejected") {
      return ad.status === "rejected";
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="bg-gradient-to-r from-purple-700 to-pink-600 px-5 py-6 text-white shadow-lg">
        <div className="mx-auto max-w-6xl">

          <Link
            href="/admin"
            className="text-sm font-bold text-white/80"
          >
            ← Admin Dashboard
          </Link>

          <h1 className="mt-2 text-3xl font-extrabold">
            Ads Management
          </h1>

          <p className="mt-1 text-sm text-white/80">
            Review and manage all advertisements
          </p>

        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

          <button
            onClick={() => setFilter("all")}
            className={`rounded-2xl p-4 text-left shadow-sm ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <p className="text-2xl">📢</p>
            <p className="mt-2 text-xs font-bold">
              ALL ADS
            </p>
            <p className="mt-1 text-2xl font-extrabold">
              {ads.length}
            </p>
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`rounded-2xl p-4 text-left shadow-sm ${
              filter === "pending"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <p className="text-2xl">⏳</p>
            <p className="mt-2 text-xs font-bold">
              PENDING
            </p>
            <p className="mt-1 text-2xl font-extrabold">
              {
                ads.filter(
                  (ad) =>
                    !ad.adminApproved &&
                    ad.status !== "rejected"
                ).length
              }
            </p>
          </button>

          <button
            onClick={() => setFilter("published")}
            className={`rounded-2xl p-4 text-left shadow-sm ${
              filter === "published"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <p className="text-2xl">✅</p>
            <p className="mt-2 text-xs font-bold">
              PUBLISHED
            </p>
            <p className="mt-1 text-2xl font-extrabold">
              {
                ads.filter(
                  (ad) => ad.adminApproved === true
                ).length
              }
            </p>
          </button>

          <button
            onClick={() => setFilter("rejected")}
            className={`rounded-2xl p-4 text-left shadow-sm ${
              filter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <p className="text-2xl">❌</p>
            <p className="mt-2 text-xs font-bold">
              REJECTED
            </p>
            <p className="mt-1 text-2xl font-extrabold">
              {
                ads.filter(
                  (ad) => ad.status === "rejected"
                ).length
              }
            </p>
          </button>

        </div>

        {message && (
          <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-bold text-gray-800 shadow-sm">
            {message}
          </div>
        )}

        <div className="mt-6">

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center font-bold text-gray-500 shadow-sm">
              Loading advertisements...
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-4xl">📭</p>
              <p className="mt-3 font-extrabold text-gray-900">
                No advertisements found
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {filteredAds.map((ad) => (

                <div
                  key={ad.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm"
                >

                  <div className="flex flex-col md:flex-row">

                    {ad.photo ? (
                      <img
                        src={ad.photo}
                        alt={ad.title || "Advertisement"}
                        className="h-56 w-full object-cover md:h-auto md:w-56"
                      />
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center bg-gray-100 text-5xl md:h-auto md:w-56">
                        📷
                      </div>
                    )}

                    <div className="flex-1 p-5">

                      <div className="flex flex-wrap items-start justify-between gap-3">

                        <div>
                          <h2 className="text-xl font-extrabold text-gray-900">
                            {ad.title || "Untitled Ad"}
                          </h2>

                          <p className="mt-1 text-sm font-semibold text-purple-600">
                            {ad.category || "No category"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                            ad.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : ad.adminApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {ad.status === "rejected"
                            ? "REJECTED"
                            : ad.adminApproved
                            ? "PUBLISHED"
                            : "PENDING"}
                        </span>

                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                        {ad.description || "No description"}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="font-bold text-gray-400">
                            District
                          </p>
                          <p className="mt-1 font-extrabold text-gray-800">
                            {ad.district || "-"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="font-bold text-gray-400">
                            Age
                          </p>
                          <p className="mt-1 font-extrabold text-gray-800">
                            {ad.age || "-"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="font-bold text-gray-400">
                            Package
                          </p>
                          <p className="mt-1 font-extrabold text-gray-800">
                            {ad.packageName || "-"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="font-bold text-gray-400">
                            Amount
                          </p>
                          <p className="mt-1 font-extrabold text-gray-800">
                            Rs. {Number(ad.packagePrice || 0).toLocaleString()}
                          </p>
                        </div>

                      </div>

                      {/* Admin-only user information */}
                      <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50 p-4">

                        <p className="text-xs font-extrabold uppercase text-purple-600">
                          🔒 Admin Only — User Information
                        </p>

                        <p className="mt-2 break-all text-xs text-gray-700">
                          User ID:{" "}
                          <span className="font-bold">
                            {ad.userId || ad.ownerUid || "-"}
                          </span>
                        </p>

                        <p className="mt-1 break-all text-xs text-gray-700">
                          Email:{" "}
                          <span className="font-bold">
                            {ad.userEmail || "-"}
                          </span>
                        </p>

                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">

                        <Link
                          href={`/ad/${ad.id}`}
                          className="rounded-xl bg-purple-100 px-4 py-3 text-sm font-extrabold text-purple-700"
                        >
                          👁️ View Ad
                        </Link>

                        {!ad.adminApproved &&
                          ad.status !== "rejected" && (
                            <button
                              onClick={() => approveAd(ad)}
                              disabled={actionId === ad.id}
                              className="rounded-xl bg-green-500 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50"
                            >
                              {actionId === ad.id
                                ? "Working..."
                                : "✅ Approve"}
                            </button>
                          )}

                        {ad.status !== "rejected" && (
                          <button
                            onClick={() => rejectAd(ad)}
                            disabled={actionId === ad.id}
                            className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50"
                          >
                            ❌ Reject
                          </button>
                        )}

                        <button
                          onClick={() => deleteAd(ad)}
                          disabled={actionId === ad.id}
                          className="rounded-xl bg-red-500 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50"
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}
