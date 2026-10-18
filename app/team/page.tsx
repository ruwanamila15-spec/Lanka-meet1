import Link from "next/link";

const whatsappNumber = "94703451773";
const whatsappMessage = encodeURIComponent(
  "Hello Lanka Meet Team, I need assistance with the website."
);

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-purple-800 to-pink-600 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-3xl">
              💜
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              We are here to help
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Lanka Meet Team
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/90">
              ඔබට Lanka Meet භාවිත කිරීමේදී උදව් අවශ්‍යද?
              දැන්වීම්, payments සහ account ගැටලු සඳහා අප හා සම්බන්ධ වන්න.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="text-xl font-extrabold text-gray-900">
              How can we help?
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              Contact our support team for help with your account,
              advertisement submission, payment receipt or general website
              questions. Please do not send passwords or verification codes.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-5 py-4 text-center font-bold text-white transition hover:bg-green-700"
            >
              <span className="text-xl">☏</span>
              Contact Support on WhatsApp
            </a>

            <p className="mt-3 text-center text-xs text-gray-500">
              WhatsApp support • Replies may take time.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/portal/how-to-post"
                className="rounded-2xl border border-purple-100 bg-purple-50 p-4 transition hover:bg-purple-100"
              >
                <span className="text-2xl">📝</span>
                <h3 className="mt-2 font-extrabold text-purple-900">
                  How to Post Ads
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Read the step-by-step guide.
                </p>
              </Link>

              <Link
                href="/portal/info"
                className="rounded-2xl border border-pink-100 bg-pink-50 p-4 transition hover:bg-pink-100"
              >
                <span className="text-2xl">💳</span>
                <h3 className="mt-2 font-extrabold text-pink-900">
                  Payment Information
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Find payment and receipt instructions.
                </p>
              </Link>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-center text-sm font-bold text-gray-800 hover:bg-gray-200"
              >
                ← Home
              </Link>

              <Link
                href="/post-ad"
                className="flex-1 rounded-xl bg-purple-700 px-4 py-3 text-center text-sm font-bold text-white hover:bg-purple-800"
              >
                + Post an Ad
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
