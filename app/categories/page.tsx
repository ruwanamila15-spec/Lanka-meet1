import Link from "next/link";

const categories = [
  {
    name: "Girls Personal",
    icon: "👩",
    description: "Browse approved advertisements in this category.",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Boys Personal",
    icon: "👨",
    description: "Explore available personal advertisements.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Spa",
    icon: "🪷",
    description: "Browse Spa-related advertisements.",
    color: "from-purple-500 to-fuchsia-600",
  },
  {
    name: "Friendship",
    icon: "🤝",
    description: "Discover friendship advertisements.",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Marriage Ads",
    icon: "💍",
    description: "Explore marriage-related advertisements.",
    color: "from-rose-500 to-pink-600",
  },
  {
    name: "Live Cam Service",
    icon: "📹",
    description: "Visit the Live Cam section.",
    color: "from-violet-500 to-purple-700",
    href: "/live-cam",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:mb-10">
          <span className="inline-flex rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-purple-700 shadow-sm">
            Lanka Meet • Explore
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Browse Categories
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            ඔබට අවශ්‍ය category එක තෝරා අදාළ දැන්වීම් බලන්න.
            Choose a category to explore relevant listings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={
                category.href ||
                `/ads?category=${encodeURIComponent(category.name)}`
              }
              className="group overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl"
            >
              <div
                className={`flex h-28 items-center justify-center bg-gradient-to-br ${category.color}`}
              >
                <span className="text-5xl transition-transform duration-200 group-hover:scale-110">
                  {category.icon}
                </span>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-extrabold text-gray-900">
                  {category.name}
                </h2>

                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
                  {category.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-purple-700">
                  {category.href ? "Open Live Cam" : "Browse Ads"}
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/ads"
            className="rounded-xl bg-purple-700 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-purple-800"
          >
            View All Ads
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-purple-200 bg-white px-6 py-3 text-center text-sm font-bold text-purple-800 transition hover:bg-purple-50"
          >
            ← Home
          </Link>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          Listings are subject to Lanka Meet's review and approval process.
        </p>
      </div>
    </main>
  );
}
