import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-purple-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center">
        <Link
          href="/about"
          className="text-sm font-extrabold text-purple-700 hover:text-purple-900"
        >
          About Lanka Meet
        </Link>

        <p className="mt-2 text-xs text-gray-500">
          Lanka Meet — Sri Lanka Personal Ads
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          © 2026 Lanka Meet. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
