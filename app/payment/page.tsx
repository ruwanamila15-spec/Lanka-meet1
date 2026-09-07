"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type PackageData = {
  id?: string;
  name?: string;
  price?: number;
};

export default function PaymentPage() {
  const router = useRouter();

  const [packageData, setPackageData] =
    useState<PackageData | null>(null);

  const [reference, setReference] =
    useState("");

  const [receiptName, setReceiptName] =
    useState("");

  const [whatsappSent, setWhatsappSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [adminWhatsapp, setAdminWhatsapp] =
    useState("94703451773");

  /* LOAD ADMIN WHATSAPP */
  useEffect(() => {
    const loadAdminWhatsapp = async () => {
      try {
        const snap = await getDoc(
          doc(db, "settings", "site")
        );

        if (snap.exists()) {
          const number = String(
            snap.data().whatsapp || ""
          ).replace(/[^0-9]/g, "");

          if (number) {
            setAdminWhatsapp(
              number.startsWith("0")
                ? "94" + number.slice(1)
                : number
            );
          }
        }
      } catch (err) {
        console.error(
          "ADMIN WHATSAPP LOAD ERROR:",
          err
        );
      }
    };

    loadAdminWhatsapp();
  }, []);

  /* LOAD PACKAGE */
  useEffect(() => {
    try {
      const savedPackage =
        localStorage.getItem(
          "lankaMeetPackage"
        );

      if (savedPackage) {
        setPackageData(
          JSON.parse(savedPackage)
        );
      } else {
        setError(
          "Package information not found."
        );
      }

      const savedAd =
        localStorage.getItem(
          "lankaMeetAd"
        );

      if (!savedAd) {
        console.log(
          "No ad found in localStorage"
        );
      }
    } catch (err) {
      console.error(
        "PAYMENT PAGE LOAD ERROR:",
        err
      );

      setError(
        "Unable to load payment information."
      );
    }
  }, []);

  /* WAIT FOR FIREBASE AUTH */
  const getCurrentUser = () => {
    return new Promise<
      import("firebase/auth").User | null
    >((resolve) => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        resolve(currentUser);
        return;
      }

      let unsubscribe:
        | (() => void)
        | undefined;

      unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (unsubscribe) {
            unsubscribe();
          }

          resolve(firebaseUser);
        }
      );
    });
  };

  /* SEND WHATSAPP */
  const sendWhatsApp = async () => {
    setError("");

    const user = await getCurrentUser();

    console.log(
      "PAYMENT AUTH:",
      user
        ? `SIGNED_IN ${user.uid}`
        : "NOT_SIGNED_IN"
    );

    if (!user) {
      setError(
        "Please login before sending payment details."
      );
      return;
    }

    if (!packageData) {
      setError(
        "Package information not found."
      );
      return;
    }

    if (!reference.trim()) {
      setError(
        "Please enter payment reference number."
      );
      return;
    }

    const message =
      `Lanka Meet Payment Receipt\n\n` +
      `Package: ${
        packageData.name || "N/A"
      }\n` +
      `Amount: Rs. ${Number(
        packageData.price || 0
      ).toLocaleString()}\n\n` +
      `Payment Reference: ${reference.trim()}\n` +
      `User ID: ${user.uid}\n\n` +
      `I have completed the payment and I am sending my payment receipt for admin verification.`;

    setWhatsappSent(true);

    window.open(
      `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  /* REQUEST BANK DETAILS */
  const requestBankDetails = () => {
    const message =
      "Hello Lanka Meet,\n\n" +
      "I need the bank account details to make my payment.\n\n" +
      "Thank you.";

    window.open(
      `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  /* SUBMIT PAYMENT + AD ATOMICALLY */
  const handleSubmit = async () => {
    console.log(
      "SUBMIT PAYMENT CLICKED"
    );

    setError("");
    setSuccess("");

    if (!packageData) {
      setError(
        "Package information not found."
      );
      return;
    }

    if (!reference.trim()) {
      setError(
        "Please enter payment reference number."
      );
      return;
    }

    if (!whatsappSent) {
      setError(
        "Please send the payment details through WhatsApp before submitting."
      );
      return;
    }

    const user = await getCurrentUser();

    console.log(
      "PAYMENT AUTH UID:",
      user?.uid
    );

    console.log(
      "PAYMENT AUTH EMAIL:",
      user?.email
    );

    if (!user) {
      setError(
        "Please login before submitting payment."
      );
      return;
    }

    setLoading(true);
    setSuccess(
      "Submitting payment..."
    );

    try {
      /* GET AD */
      const savedAd =
        localStorage.getItem(
          "lankaMeetAd"
        );

      if (!savedAd) {
        throw new Error(
          "Ad information not found. Please create the ad again."
        );
      }

      const adData = JSON.parse(savedAd);

      /*
       * CREATE BOTH DOCUMENT REFERENCES FIRST.
       * This gives us IDs before writing anything.
       */
      const paymentRef = doc(
        collection(db, "payments")
      );

      const adRef = doc(
        collection(db, "ads")
      );

      console.log(
        "PAYMENT ID:",
        paymentRef.id
      );

      console.log(
        "AD ID:",
        adRef.id
      );

      /*
       * PAYMENT DATA
       *
       * adId is included from the beginning.
       * No updateDoc() is needed.
       */
      const paymentData = {
        adId: adRef.id,

        userId: user.uid,

        userEmail:
          user.email || "",

        packageId: packageData.id || "",
        packageName:
          packageData.name || "",

        amount: Number(
          packageData.price || 0
        ),

        reference:
          reference.trim(),

        receiptName:
          receiptName.trim() ||
          "Receipt sent via WhatsApp",

        status: "pending",

        paymentStatus:
          "receipt_submitted",

        adminApproved: false,

        receiptSentViaWhatsApp:
          true,

        createdAt:
          serverTimestamp(),
      };

      /*
       * AD DATA
       */
      const firestoreAd = {
        ...adData,
          price: Number(adData.price || 0),

          userId: user.uid,

          ownerUid: user.uid,


        /*
         * Keep uid as well because your current
         * Firestore update/delete rule checks uid.
         */
        uid: user.uid,

        packageId: packageData.id || "",
        packageName:
          packageData.name || "",

        packagePrice: Number(
          packageData.price || 0
        ),

        paymentId:
          paymentRef.id,

        paymentStatus:
          "pending",

        status:
          "pending",

        adminApproved:
          false,

        createdAt:
          serverTimestamp(),
      };

      /*
       * ATOMIC FIRESTORE WRITE
       *
       * Both documents are created together.
       * There is NO payment update after creation.
       */
      console.log("STEP 1: BATCH CREATING PAYMENT + AD");

      console.log("PAYMENT DEBUG:", {
        paymentId: paymentRef.id,
        adId: adRef.id,
        packageId: packageData.id,
        packageName: packageData.name,
        packagePrice: packageData.price,
        paymentAmount: paymentData.amount,
        adPackageId: firestoreAd.packageId,
        adPackageName: firestoreAd.packageName,
        adPackagePrice: firestoreAd.packagePrice,
        uid: user.uid,
      });

      if (!packageData.id) {
        throw new Error("Package ID is missing. Please go back and select the package again.");
      }

      const packageRef = doc(db, "packages", packageData.id);
      const packageSnap = await getDoc(packageRef);

      if (!packageSnap.exists()) {
        throw new Error("Selected package was not found in Firebase. Package ID: " + packageData.id);
      }

      const firebasePackage = packageSnap.data();

      console.log("FIREBASE PACKAGE DEBUG:", {
        id: packageData.id,
        name: firebasePackage.name,
        price: firebasePackage.price,
        enabled: firebasePackage.enabled,
      });

      if (firebasePackage.enabled !== true) {
        throw new Error("Selected package is disabled. Package: " + (firebasePackage.name || packageData.name));
      }

      if (firebasePackage.name !== packageData.name || Number(firebasePackage.price) !== Number(packageData.price)) {
        throw new Error("Package information mismatch. Firebase: " + firebasePackage.name + " / " + firebasePackage.price + ", Selected: " + packageData.name + " / " + packageData.price);
      }

      const batch = writeBatch(db);

      batch.set(paymentRef, paymentData);
      batch.set(adRef, firestoreAd);

      await batch.commit();

      console.log("STEP 1 SUCCESS: PAYMENT + AD CREATED");


      /*
       * UPDATE LOCAL STORAGE
       */
      localStorage.setItem(
        "lankaMeetAd",
        JSON.stringify({
          ...adData,
          price: Number(adData.price || 0),

          userId:
            user.uid,

          userEmail:
            user.email || "",

          ownerUid:
            user.uid,

          uid:
            user.uid,

          packageId: packageData.id || "",
        packageName:
            packageData.name || "",

          packagePrice:
            Number(
              packageData.price || 0
            ),

          paymentId:
            paymentRef.id,

          adId:
            adRef.id,

          paymentStatus:
            "pending",

          status:
            "pending",
        })
      );

      localStorage.removeItem(
        "lankaMeetPackage"
      );

      setLoading(false);

      setSuccess(
        "Payment submitted successfully. Your ad is pending admin approval."
      );

      console.log(
        "PAYMENT SUBMISSION COMPLETE"
      );

      setTimeout(() => {
        router.push(
          "/portal/info"
        );
      }, 1500);
    } catch (err: any) {
      console.error(
        "PAYMENT ERROR:",
        err
      );

      console.error(
        "PAYMENT ERROR CODE:",
        err?.code
      );

      console.error(
        "PAYMENT ERROR MESSAGE:",
        err?.message
      );

      setLoading(false);

      setError(
        err?.message ||
          "Payment submission failed. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-lg">

        <div className="mb-6 rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white shadow-lg">
          <h1 className="text-3xl font-extrabold">
            Payment
          </h1>

          <p className="mt-2 text-sm text-white/90">
            Complete your payment and submit
            your payment reference.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">

          {packageData && (
            <div className="mb-6 rounded-2xl bg-purple-50 p-5">
              <p className="text-xs font-bold uppercase text-gray-500">
                Selected Package
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
                {packageData.name ||
                  "Package"}
              </h2>

              <p className="mt-2 text-2xl font-extrabold text-purple-600">
                Rs.{" "}
                {Number(
                  packageData.price || 0
                ).toLocaleString()}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              {success}
            </div>
          )}

          <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-xl text-white">
                🏦
              </div>

              <div>
                <p className="text-sm font-extrabold text-gray-900">
                  Bank Account Details
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-600">
                  බැංකු ගිණුම් විස්තර සඳහා
                  WhatsApp button එක click කරන්න.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={requestBankDetails}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-green-500 py-3 font-extrabold text-white shadow-md transition hover:bg-green-600 disabled:opacity-50"
            >
              🟢 Get Bank Details via WhatsApp
            </button>
          </div>

          <label className="block text-sm font-bold text-gray-700">
            Payment Reference Number
          </label>

          <input
            type="text"
            value={reference}
            onChange={(e) =>
              setReference(
                e.target.value
              )
            }
            placeholder="Enter payment reference"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
          />

          <label className="mt-5 block text-sm font-bold text-gray-700">
            Receipt Name
            <span className="ml-1 text-xs font-normal text-gray-400">
              (optional)
            </span>
          </label>

          <input
            type="text"
            value={receiptName}
            onChange={(e) =>
              setReceiptName(
                e.target.value
              )
            }
            placeholder="Example: payment.jpg"
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
          />

          <div className="mt-5 rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
            <p className="font-extrabold">
              📱 Payment Receipt
            </p>

            <p className="mt-2 leading-6">
              Send your payment receipt to
              our WhatsApp number before
              submitting the payment.
            </p>

            <p className="mt-2 font-extrabold">
              WhatsApp: 070 345 1773
            </p>
          </div>

          <button
            type="button"
            onClick={sendWhatsApp}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-green-500 py-4 font-extrabold text-white shadow-md transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {whatsappSent
              ? "✅ WhatsApp Sent"
              : "📱 Send Receipt via WhatsApp"}
          </button>

          {whatsappSent && (
            <div className="mt-3 rounded-xl bg-green-50 p-3 text-center text-sm font-bold text-green-700">
              ✅ WhatsApp step completed.
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              !reference.trim() ||
              !whatsappSent
            }
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-4 font-extrabold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Submitting Payment..."
              : "✅ Submit Payment"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-gray-500">
            After submission, your payment
            will be reviewed by the admin.
            Your advertisement will be
            published after approval.
          </p>

        </div>
      </div>
    </main>
  );
}
