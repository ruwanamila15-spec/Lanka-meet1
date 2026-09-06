
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdData = {
  id?: string;
  title?: string;
  category?: string;
  packageName?: string;
  packagePrice?: number;
  publicUserId?: string;
  status?: string;
  paymentStatus?: string;
};

export default function InfoPage() {
  const [ad, setAd] = useState<AdData | null>(null);

  useEffect(() => {
    try {
      const savedAd = localStorage.getItem("lankaMeetAd");

      if (savedAd) {
        setAd(JSON.parse(savedAd));
      }
    } catch (error) {
      console.error("INFO PAGE ERROR:", error);
    }
  }, []);

  const whatsappNumber = "94703451773";

  const whatsappMessage = encodeURIComponent(
    `Lanka Meet Payment Receipt

Ad Title: ${ad?.title || "N/A"}
Package: ${ad?.packageName || "N/A"}
Amount: Rs. ${ad?.packagePrice?.toLocaleString() || "0"}
User ID: ${ad?.publicUserId || "N/A"}

I have completed the payment. I am sending my payment receipt for admin approval.`
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">

      <div className="mx-auto max-w-2xl">

        {/* Success Header */}
        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-gray-900">
            Ad Created Successfully!
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your advertisement has been submitted successfully.
          </p>

        </div>

        {/* Main Card */}
        <div className="mt-7 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">

          {/* Sinhala Notice */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

            <h2 className="text-lg font-extrabold text-green-800">
              දැන්වීම සාර්ථකව නිර්මාණය කරන ලදී!
            </h2>

            <p className="mt-3 text-sm leading-7 text-green-900">
              ඔබගේ දැන්වීම සාර්ථකව අපගේ පද්ධතියට යොමු කර ඇත.
              දැනට ඔබගේ දැන්වීම{" "}
              <strong>Admin Approval Pending</strong>{" "}
              තත්ත්වයේ පවතී.
            </p>

            <p className="mt-2 text-sm leading-7 text-green-900">
              Admin විසින් දැන්වීම පරීක්ෂා කර approve කළ පසු
              ඔබගේ දැන්වීම Lanka Meet හි publish කරනු ලැබේ.
            </p>

          </div>

          {/* English Notice */}
          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">

            <h2 className="text-lg font-extrabold text-blue-800">
              Your Ad Is Pending Approval
            </h2>

            <p className="mt-3 text-sm leading-7 text-blue-900">
              Your advertisement has been successfully submitted.
              It is currently{" "}
              <strong>Pending Admin Approval</strong>.
            </p>

            <p className="mt-2 text-sm leading-7 text-blue-900">
              Your advertisement will be published after our
              admin reviews and approves it.
            </p>

          </div>

          {/* Payment Notice */}
          <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-5">

            <h2 className="text-lg font-extrabold text-purple-800">
              💳 Payment & Receipt
            </h2>

            <div className="mt-3 text-sm leading-7 text-purple-900">

              <p>
                <strong>සිංහල:</strong>
              </p>

              <p>
                Paid package එකක් තෝරාගෙන තිබේ නම්,
                කරුණාකර payment එක සිදු කර
                <strong> payment receipt එක WhatsApp හරහා </strong>
                අප වෙත එවන්න.
              </p>

              <p className="mt-3">
                <strong>English:</strong>
              </p>

              <p>
                If you selected a paid package, please complete
                the payment and send your{" "}
                <strong>payment receipt via WhatsApp</strong>{" "}
                for admin verification.
              </p>

            </div>

          </div>

          {/* Ad Details */}
          {ad && (
            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">

              <h2 className="text-lg font-extrabold text-gray-900">
                Ad Details
              </h2>

              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Ad Title
                  </span>

                  <span className="text-right font-bold text-gray-900">
                    {ad.title || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="font-bold text-gray-900">
                    {ad.category || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Package
                  </span>

                  <span className="font-bold text-purple-600">
                    {ad.packageName || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Amount
                  </span>

                  <span className="font-bold text-gray-900">
                    Rs.{" "}
                    {ad.packagePrice?.toLocaleString() || "0"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    User ID
                  </span>

                  <span className="font-bold text-purple-600">
                    {ad.publicUserId || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                    Pending Approval
                  </span>
                </div>

              </div>

            </div>
          )}

          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-4 text-center font-extrabold text-white shadow-md transition hover:bg-green-600"
          >
            <span className="text-xl">💬</span>
            Send Payment Receipt via WhatsApp
          </a>

          <p className="mt-3 text-center text-xs text-gray-500">
            Payment receipt එක WhatsApp හරහා යැවීමෙන්
            admin verification එක ඉක්මනින් සිදු කළ හැක.
          </p>

          {/* Buttons */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

            <Link
              href="/"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-center font-bold text-gray-700 transition hover:bg-gray-50"
            >
              ← Back to Home
            </Link>

            <Link
              href="/ads"
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-center font-bold text-white transition hover:opacity-90"
            >
              Browse Ads
            </Link>

          </div>

        </div>

        {/* Bottom Note */}
        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-center text-sm leading-6 text-yellow-800">

          <strong>Important / වැදගත්:</strong>

          <br />

          ඔබගේ දැන්වීම Admin approval ලැබෙන තුරු
          public ලෙස පෙන්වන්නේ නැත.

          <br />

          Your ad will not be publicly visible until it is
          approved by the admin.

        </div>

      </div>

    </main>
  );
}

