import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-2xl font-extrabold text-purple-700">
          About Lanka Meet
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Lanka Meet is a Sri Lankan personal advertisements platform where
          users can publish and discover personal ads across Sri Lanka.
        </p>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Our goal is to provide a simple and convenient platform for people
          to share personal advertisements and find suitable connections.
        </p>

        <div className="mt-6 rounded-2xl bg-purple-50 p-4 text-sm text-purple-800">
          <p className="font-bold">Lanka Meet</p>
          <p className="mt-1">Sri Lanka Personal Ads</p>
          <p className="mt-2 text-xs text-purple-600">
            © 2026 Lanka Meet. All Rights Reserved.
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-purple-700 px-5 py-3 text-sm font-bold text-white"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
