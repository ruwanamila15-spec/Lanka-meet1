"use client";

import Link from "next/link";

const adminSections = [
  {
    icon: "📊",
    title: "Dashboard",
    description: "Site overview and statistics",
    href: "/admin",
  },
  {
    icon: "📢",
    title: "Ads Management",
    description: "Approve, reject and manage ads",
    href: "/admin/ads",
  },
  {
    icon: "💳",
    title: "Payments",
    description: "Review and approve payments",
    href: "/admin/payments",
  },
  {
    icon: "👥",
    title: "Users",
    description: "Manage registered users",
    href: "/admin/users",
  },
  {
    icon: "📂",
    title: "Categories",
    description: "Manage ad categories",
    href: "/admin/categories",
  },
  {
    icon: "📦",
    title: "Packages",
    description: "Manage advertising packages",
    href: "/admin/packages",
  },
  {
    icon: "⚙️",
    title: "Settings",
    description: "Website and contact settings",
    href: "/admin/settings",
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-pink-600 px-5 py-6 text-white shadow-lg">
        <div className="mx-auto max-w-6xl">

          <p className="text-sm font-semibold text-white/80">
            Lanka Meet
          </p>

          <h1 className="mt-1 text-3xl font-extrabold">
            Admin Panel
          </h1>

          <p className="mt-1 text-sm text-white/80">
            Manage your website from one place
          </p>

        </div>
      </header>

      {/* Dashboard */}
      <section className="mx-auto max-w-6xl px-4 py-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-2xl">👥</p>
            <p className="mt-3 text-xs font-bold text-gray-500">
              USERS
            </p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">
              —
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-2xl">📢</p>
            <p className="mt-3 text-xs font-bold text-gray-500">
              ADS
            </p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">
              —
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-2xl">⏳</p>
            <p className="mt-3 text-xs font-bold text-gray-500">
              PENDING ADS
            </p>
            <p className="mt-1 text-2xl font-extrabold text-orange-500">
              —
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-2xl">💳</p>
            <p className="mt-3 text-xs font-bold text-gray-500">
              PAYMENTS
            </p>
            <p className="mt-1 text-2xl font-extrabold text-green-600">
              —
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-2xl">💰</p>
            <p className="mt-3 text-xs font-bold text-gray-500">
              REVENUE
            </p>
            <p className="mt-1 text-2xl font-extrabold text-purple-600">
              Rs. 0
            </p>
          </div>

        </div>

        {/* Management */}
        <div className="mt-8">

          <h2 className="mb-4 text-xl font-extrabold text-gray-900">
            Management
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {adminSections.map((section) => {

              const disabled =
                section.href === "#";

              if (disabled) {
                return (
                  <div
                    key={section.title}
                    className="rounded-2xl bg-white p-5 opacity-60 shadow-sm"
                  >
                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                        {section.icon}
                      </div>

                      <div>
                        <h3 className="font-extrabold text-gray-900">
                          {section.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {section.description}
                        </p>

                        <p className="mt-2 text-xs font-bold text-gray-400">
                          Coming soon
                        </p>
                      </div>

                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                      {section.icon}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-gray-900">
                        {section.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {section.description}
                      </p>

                      <p className="mt-2 text-xs font-bold text-purple-600">
                        Open →
                      </p>
                    </div>

                  </div>
                </Link>
              );
            })}

          </div>

        </div>

        {/* Security Notice */}
        <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5">

          <div className="flex gap-3">

            <div className="text-2xl">
              🔐
            </div>

            <div>
              <h3 className="font-extrabold text-red-900">
                Admin Security
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-700">
                Admin-only information should be protected
                using Firebase Authentication and Firestore
                Security Rules.
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
