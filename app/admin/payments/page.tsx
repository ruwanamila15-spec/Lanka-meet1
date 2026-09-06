


"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type Payment = {
  id: string;
  userId?: string;
  userEmail?: string;
  packageName?: string;
  amount?: number;
  reference?: string;
  receiptName?: string;
  receiptSentViaWhatsApp?: boolean;
  status?: string;
  paymentStatus?: string;
  adId?: string;
  createdAt?: any;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [error, setError] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      try {
        const paymentsQuery = query(
          collection(db, "payments"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(paymentsQuery);

        const data: Payment[] = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Payment[];

        setPayments(data);
      } catch (orderError) {
        console.error(
          "ORDERED PAYMENTS LOAD ERROR:",
          orderError
        );

        const snapshot = await getDocs(
          collection(db, "payments")
        );

        const data: Payment[] = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Payment[];

        data.sort((a, b) => {
          const aTime =
            a.createdAt?.seconds || 0;
          const bTime =
            b.createdAt?.seconds || 0;

          return bTime - aTime;
        });

        setPayments(data);
      }
    } catch (err: any) {
      console.error(
        "LOAD PAYMENTS ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const findRelatedAd = async (
    payment: Payment
  ) => {
    const adsSnapshot = await getDocs(
      collection(db, "ads")
    );

    const ads = adsSnapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as any[];

    if (payment.adId) {
      const directAd = ads.find(
        (ad) => ad.id === payment.adId
      );

      if (directAd) {
        return directAd;
      }
    }

    const matchingAds = ads.filter((ad) => {
      const sameUser =
        ad.ownerUid === payment.userId ||
        ad.userId === payment.userId;

      const samePackage =
        ad.packageName === payment.packageName;

      const sameAmount =
        Number(ad.packagePrice || 0) ===
        Number(payment.amount || 0);

      return (
        sameUser &&
        samePackage &&
        sameAmount
      );
    });

    matchingAds.sort((a, b) => {
      const aTime =
        a.createdAt?.seconds ||
        new Date(a.createdAt || 0).getTime() ||
        0;

      const bTime =
        b.createdAt?.seconds ||
        new Date(b.createdAt || 0).getTime() ||
        0;

      return bTime - aTime;
    });

    return matchingAds[0] || null;
  };

  const approvePayment = async (
    payment: Payment
  ) => {
    if (
      !window.confirm(
        "Approve this payment and publish the related ad?"
      )
    ) {
      return;
    }

    setUpdating(payment.id);
    setError("");

    try {
      const relatedAd =
        await findRelatedAd(payment);

      await updateDoc(
        doc(db, "payments", payment.id),
        {
          status: "approved",
          paymentStatus: "paid",
          adminApproved: true,
          approvedAt: serverTimestamp(),

          ...(relatedAd?.id
            ? { adId: relatedAd.id }
            : {}),
        }
      );

      if (relatedAd?.id) {
        await updateDoc(
          doc(db, "ads", relatedAd.id),
          {
            status: "published",
            paymentStatus: "paid",
            adminApproved: true,
            publishedAt: serverTimestamp(),
          }
        );
      }

      setPayments((current) =>
        current.map((item) =>
          item.id === payment.id
            ? {
                ...item,
                status: "approved",
                paymentStatus: "paid",
              }
            : item
        )
      );

      if (relatedAd?.id) {
        alert(
          "Payment approved successfully. The advertisement is now published."
        );
      } else {
        alert(
          "Payment approved, but the related advertisement could not be found."
        );
      }
    } catch (err: any) {
      console.error(
        "APPROVE PAYMENT ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to approve payment."
      );
    } finally {
      setUpdating("");
    }
  };

  const rejectPayment = async (
    payment: Payment
  ) => {
    if (
      !window.confirm(
        "Reject this payment and reject the related ad?"
      )
    ) {
      return;
    }

    setUpdating(payment.id);
    setError("");

    try {
      const relatedAd =
        await findRelatedAd(payment);

      await updateDoc(
        doc(db, "payments", payment.id),
        {
          status: "rejected",
          paymentStatus: "rejected",
          adminApproved: false,
          rejectedAt: serverTimestamp(),

          ...(relatedAd?.id
            ? { adId: relatedAd.id }
            : {}),
        }
      );

      if (relatedAd?.id) {
        await updateDoc(
          doc(db, "ads", relatedAd.id),
          {
            status: "rejected",
            paymentStatus: "rejected",
            adminApproved: false,
            rejectedAt: serverTimestamp(),
          }
        );
      }

      setPayments((current) =>
        current.map((item) =>
          item.id === payment.id
            ? {
                ...item,
                status: "rejected",
                paymentStatus: "rejected",
              }
            : item
        )
      );

      alert(
        "Payment rejected successfully."
      );
    } catch (err: any) {
      console.error(
        "REJECT PAYMENT ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to reject payment."
      );
    } finally {
      setUpdating("");
    }
  };

  const formatDate = (
    timestamp: any
  ) => {
    if (!timestamp) {
      return "Date unavailable";
    }

    try {
      if (timestamp?.seconds) {
        return new Date(
          timestamp.seconds * 1000
        ).toLocaleString();
      }

      if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
      }

      return new Date(
        timestamp
      ).toLocaleString();
    } catch {
      return "Date unavailable";
    }
  };

  const getStatusClass = (
    status: string
  ) => {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-3xl font-extrabold text-black">
            Admin Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review payments and approve advertisements
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow">

            <div className="text-lg font-bold text-gray-700">
              Loading payments...
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Please wait.
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          payments.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow">

              <div className="text-4xl">
                💳
              </div>

              <p className="mt-3 font-bold text-gray-700">
                No payments found.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                New payment submissions will appear here.
              </p>

            </div>
          )}

        {/* PAYMENTS */}

        {!loading &&
          payments.length > 0 && (
            <div className="space-y-5">

              {payments.map((payment) => {

                const currentStatus =
                  payment.status || "pending";

                const isUpdating =
                  updating === payment.id;

                return (
                  <div
                    key={payment.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-lg"
                  >

                    {/* TOP */}

                    <div className="border-b border-gray-100 p-5">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                            Payment
                          </p>

                          <h2 className="mt-1 text-xl font-extrabold text-black">
                            {payment.packageName ||
                              "Payment"}
                          </h2>

                          <p className="mt-1 text-2xl font-extrabold text-purple-600">
                            Rs.{" "}
                            {Number(
                              payment.amount || 0
                            ).toLocaleString()}
                          </p>

                        </div>

                        <span
                          className={`w-fit rounded-full px-4 py-2 text-xs font-extrabold ${getStatusClass(
                            currentStatus
                          )}`}
                        >
                          {currentStatus.toUpperCase()}
                        </span>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="p-5">

                      <div className="grid gap-3 sm:grid-cols-2">

                        {/* USER */}

                        <div className="rounded-2xl bg-gray-50 p-4">

                          <p className="text-xs font-bold uppercase text-gray-400">
                            Private User Information
                          </p>

                          <p className="mt-3 break-all text-sm text-black">
                            <b>Email:</b>{" "}
                            {payment.userEmail ||
                              "No email"}
                          </p>

                          <p className="mt-2 break-all text-xs text-gray-500">
                            <b>User ID:</b>{" "}
                            {payment.userId ||
                              "No user ID"}
                          </p>

                        </div>

                        {/* PAYMENT */}

                        <div className="rounded-2xl bg-gray-50 p-4">

                          <p className="text-xs font-bold uppercase text-gray-400">
                            Payment Information
                          </p>

                          <p className="mt-3 break-all text-sm text-black">
                            <b>Reference:</b>{" "}
                            {payment.reference ||
                              "No reference"}
                          </p>

                          <p className="mt-2 text-sm text-gray-600">
                            <b>Submitted:</b>{" "}
                            {formatDate(
                              payment.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                      {/* RECEIPT */}

                      <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">

                        <p className="text-sm font-extrabold text-green-800">
                          🧾 Payment Receipt
                        </p>

                        <p className="mt-2 break-all text-xs text-gray-600">
                          {payment.receiptName ||
                            "Receipt selected by user"}
                        </p>

                        {payment.receiptSentViaWhatsApp ? (
                          <div className="mt-3 rounded-xl bg-white p-3">

                            <p className="text-sm font-bold text-green-600">
                              ✓ Receipt Sent via WhatsApp
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Please verify the receipt received
                              in WhatsApp before approving.
                            </p>

                          </div>
                        ) : (
                          <p className="mt-3 text-sm font-semibold text-red-600">
                            ⚠ WhatsApp receipt confirmation not found.
                          </p>
                        )}

                      </div>

                      {/* ACTIONS */}

                      {currentStatus === "pending" && (
                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                          <button
                            type="button"
                            onClick={() =>
                              approvePayment(payment)
                            }
                            disabled={isUpdating}
                            className="rounded-xl bg-green-500 py-4 font-extrabold text-white shadow-md transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdating
                              ? "Updating..."
                              : "✅ Approve & Publish Ad"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              rejectPayment(payment)
                            }
                            disabled={isUpdating}
                            className="rounded-xl bg-red-500 py-4 font-extrabold text-white shadow-md transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdating
                              ? "Updating..."
                              : "❌ Reject Payment"}
                          </button>

                        </div>
                      )}

                      {/* APPROVED */}

                      {currentStatus === "approved" && (
                        <div className="mt-5 rounded-2xl bg-green-50 p-4 text-center">

                          <p className="font-extrabold text-green-700">
                            ✅ Payment Approved
                          </p>

                          <p className="mt-1 text-sm text-green-600">
                            The related advertisement has been published.
                          </p>

                        </div>
                      )}

                      {/* REJECTED */}

                      {currentStatus === "rejected" && (
                        <div className="mt-5 rounded-2xl bg-red-50 p-4 text-center">

                          <p className="font-extrabold text-red-700">
                            ❌ Payment Rejected
                          </p>

                          <p className="mt-1 text-sm text-red-600">
                            The related advertisement is not published.
                          </p>

                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        {/* REFRESH */}

        <button
          type="button"
          onClick={loadPayments}
          disabled={loading}
          className="mt-6 w-full rounded-xl border border-gray-200 bg-white py-3 font-bold text-gray-700 shadow-sm disabled:opacity-50"
        >
          🔄 Refresh Payments
        </button>

      </div>

    </main>
  );
}





