"use client";

import Link from "next/link";

const steps = [
  {
    number: "1",
    titleSi: "ගිණුමට Login වන්න",
    titleEn: "Login to your account",
    textSi:
      "මුලින්ම ඔබගේ Lanka Meet ගිණුමට Login වන්න. ගිණුමක් නොමැති නම් Register වන්න.",
    textEn:
      "First, login to your Lanka Meet account. If you do not have an account, register first.",
  },
  {
    number: "2",
    titleSi: "Post an Ad තෝරන්න",
    titleEn: "Select Post an Ad",
    textSi:
      "Menu එකෙන් හෝ + Post Ad button එකෙන් Post an Ad page එකට යන්න.",
    textEn:
      "Open the Post an Ad page from the Menu or by clicking the + Post Ad button.",
  },
  {
    number: "3",
    titleSi: "දැන්වීමේ විස්තර පුරවන්න",
    titleEn: "Enter your advertisement details",
    textSi:
      "Category, Title, Age, District, Location සහ About වැනි අවශ්‍ය තොරතුරු නිවැරදිව පුරවන්න.",
    textEn:
      "Enter the required details correctly, including Category, Title, Age, District, Location and About.",
  },
  {
    number: "4",
    titleSi: "Phone / WhatsApp අංකය ලබා දෙන්න",
    titleEn: "Enter your Phone / WhatsApp number",
    textSi:
      "ඔබට සම්බන්ධ විය හැකි නිවැරදි Mobile Number සහ WhatsApp Number ලබා දෙන්න.",
    textEn:
      "Enter a valid Mobile Number and WhatsApp Number where you can be contacted.",
  },
  {
    number: "5",
    titleSi: "Photo එක Upload කරන්න",
    titleEn: "Upload your photo",
    textSi:
      "ඔබගේ දැන්වීමට සුදුසු photo එකක් upload කරන්න. පැහැදිලි සහ සුදුසු photo එකක් භාවිතා කරන්න.",
    textEn:
      "Upload a suitable photo for your advertisement. Use a clear and appropriate photo.",
  },
  {
    number: "6",
    titleSi: "Package එක තෝරන්න",
    titleEn: "Choose an advertisement package",
    textSi:
      "Normal, Premium හෝ VIP package එකෙන් ඔබට අවශ්‍ය package එක තෝරන්න.",
    textEn:
      "Choose the package you want: Normal, Premium or VIP.",
  },
  {
    number: "7",
    titleSi: "දැන්වීම Submit කරන්න",
    titleEn: "Submit your advertisement",
    textSi:
      "සියලුම තොරතුරු නැවත පරීක්ෂා කර Submit / Post Ad button එක ඔබන්න.",
    textEn:
      "Check all your information carefully and click the Submit / Post Ad button.",
  },
  {
    number: "8",
    titleSi: "Payment එක සම්පූර්ණ කරන්න",
    titleEn: "Complete the payment",
    textSi:
      "තෝරාගත් package එකට අදාල payment එක සම්පූර්ණ කරන්න.",
    textEn:
      "Complete the payment for your selected advertisement package.",
  },
  {
    number: "9",
    titleSi: "Payment Receipt එක WhatsApp කරන්න",
    titleEn: "Send the payment receipt on WhatsApp",
    textSi:
      "Payment එකෙන් පසු ඔබගේ payment receipt එක ලබා දී ඇති WhatsApp අංකයට යවන්න.",
    textEn:
      "After completing the payment, send your payment receipt to the WhatsApp number provided.",
  },
  {
    number: "10",
    titleSi: "Admin Approval බලා සිටින්න",
    titleEn: "Wait for Admin Approval",
    textSi:
      "Payment receipt එක යැවූ පසු Admin විසින් ඔබගේ දැන්වීම පරීක්ෂා කර approve කරනු ඇත. Approve කළ පසු දැන්වීම publish වේ.",
    textEn:
      "After sending the payment receipt, our Admin will review and approve your advertisement. Your ad will be published after approval.",
  },
];

export default function HowToPostPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
            📝
          </div>

          <h1 className="mt-4 text-2xl font-black text-gray-900 sm:text-3xl">
            How to Publish an Ad
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            දැන්වීමක් පළ කරන ආකාරය • Step-by-step Guide
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <h2 className="text-lg font-black text-yellow-800">
            ⚠️ වැදගත් දැනුම්දීම / Important Notice
          </h2>

          <p className="mt-2 text-sm leading-7 text-yellow-900">
            දැන්වීමක් publish වීමට පෙර Admin Approval අවශ්‍ය වේ.
            Payment receipt එක WhatsApp කිරීමෙන් පසු Admin විසින්
            දැන්වීම පරීක්ෂා කර approve කරනු ඇත.
          </p>

          <p className="mt-2 text-sm leading-7 text-yellow-900">
            Admin approval is required before an advertisement can be
            published. After sending your payment receipt on WhatsApp,
            the Admin will review and approve your advertisement.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-700 text-lg font-black text-white">
                  {step.number}
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-black text-purple-800 sm:text-lg">
                    {step.titleSi}
                  </h2>

                  <h3 className="mt-1 text-sm font-bold text-gray-800">
                    {step.titleEn}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {step.textSi}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {step.textEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
          <h2 className="text-lg font-black text-green-800">
            ✅ අවසාන දැනුම්දීම / Final Notice
          </h2>

          <p className="mt-2 text-sm leading-7 text-green-900">
            ඔබගේ දැන්වීම Admin විසින් approve කළ පසු පමණක් Lanka Meet
            වෙබ් අඩවියේ public ලෙස පෙන්වනු ලැබේ.
          </p>

          <p className="mt-2 text-sm leading-7 text-green-900">
            Your advertisement will be displayed publicly on Lanka Meet
            only after it has been reviewed and approved by the Admin.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-center text-sm font-bold text-gray-700"
          >
            ← Home
          </Link>

          <Link
            href="/post-ad"
            className="flex-1 rounded-xl bg-purple-700 px-4 py-3 text-center text-sm font-bold text-white"
          >
            + Post an Ad
          </Link>
        </div>
      </div>
    </main>
  );
}
