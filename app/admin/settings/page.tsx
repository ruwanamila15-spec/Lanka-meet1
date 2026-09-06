"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Lanka Meet");
  const [whatsapp, setWhatsapp] = useState("0703451773");
  const [contactEmail, setContactEmail] = useState("");
  const [paymentNotice, setPaymentNotice] = useState(
    "බැංකු ගිණුම් විස්තර සඳහා WhatsApp button එක click කරන්න."
  );
  const [bankNotice, setBankNotice] = useState(
    "Payment කිරීමට පෙර bank account details WhatsApp මගින් ලබාගන්න."
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const ref = doc(db, "settings", "site");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setSiteName(data.siteName || "Lanka Meet");
          setWhatsapp(data.whatsapp || "0703451773");
          setContactEmail(data.contactEmail || "");
          setPaymentNotice(
            data.paymentNotice ||
              "බැංකු ගිණුම් විස්තර සඳහා WhatsApp button එක click කරන්න."
          );
          setBankNotice(
            data.bankNotice ||
              "Payment කිරීමට පෙර bank account details WhatsApp මගින් ලබාගන්න."
          );
        }
      } catch (error) {
        console.error("SETTINGS LOAD ERROR:", error);
        setMessage("❌ Unable to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage("");

      await setDoc(
        doc(db, "settings", "site"),
        {
          siteName: siteName.trim() || "Lanka Meet",
          whatsapp: whatsapp.trim(),
          contactEmail: contactEmail.trim(),
          paymentNotice: paymentNotice.trim(),
          bankNotice: bankNotice.trim(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setMessage("✅ Settings saved successfully.");
    } catch (error) {
      console.error("SETTINGS SAVE ERROR:", error);
      setMessage("❌ Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-purple-700 to-pink-600 p-6 text-white shadow-lg">
          <p className="text-sm font-semibold text-white/80">Lanka Meet</p>
          <h1 className="mt-1 text-3xl font-extrabold">
            Settings
          </h1>
          <p className="mt-1 text-sm text-white/80">
            Manage website and contact settings
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          {message && (
            <div className="mb-5 rounded-2xl bg-gray-50 p-4 text-sm font-bold text-gray-700">
              {message}
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center font-bold text-gray-500">
              Loading settings...
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Site Name
                </label>
                <input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  WhatsApp Number
                </label>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="0703451773"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Payment Notice
                </label>
                <textarea
                  value={paymentNotice}
                  onChange={(e) => setPaymentNotice(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Bank Details Notice
                </label>
                <textarea
                  value={bankNotice}
                  onChange={(e) => setBankNotice(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-4 font-extrabold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "💾 Save Settings"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
