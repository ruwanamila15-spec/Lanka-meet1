const categories = [
  { icon: "💕", name: "Dating" },
  { icon: "👩", name: "Girl Personal" },
  { icon: "👨", name: "Boy Personal" },
  { icon: "🤝", name: "Friendship" },
  { icon: "💍", name: "Marriage" },
  { icon: "💬", name: "Chat & Meet" },
  { icon: "❤️", name: "Relationship" },
  { icon: "👥", name: "Make Friends" },
];

const personalAds = [
  {
    name: "Nimali",
    age: 25,
    district: "Colombo",
    category: "Girl Personal",
    text: "Looking to meet a kind and genuine person.",
    emoji: "👩🏻",
  },
  {
    name: "Kasun",
    age: 29,
    district: "Gampaha",
    category: "Boy Personal",
    text: "Looking for friendship and meaningful conversations.",
    emoji: "👨🏻",
  },
  {
    name: "Shalini",
    age: 27,
    district: "Kandy",
    category: "Dating",
    text: "Would like to meet someone friendly and honest.",
    emoji: "👩🏽",
  },
  {
    name: "Dilan",
    age: 31,
    district: "Kurunegala",
    category: "Marriage",
    text: "Interested in meeting someone for a serious relationship.",
    emoji: "👨🏽",
  },
];

const districts = [
  "All Sri Lanka",
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Galle",
  "Matara",
  "Kurunegala",
  "Negombo",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white shadow-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          <div className="flex items-center gap-2">

            <button
              type="button"
              className="rounded-lg p-2 text-2xl hover:bg-white/10"
            >
              ☰
            </button>

            <div className="flex items-center gap-2">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow">
                💕
              </div>

              <div>
                <div className="text-lg font-extrabold leading-tight">
                  Lanka Meet
                </div>

                <div className="text-[10px] text-white/80">
                  Sri Lanka Personal Ads
                </div>
              </div>

            </div>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10 sm:block"
            >
              Login
            </button>

            <button
              type="button"
              className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-purple-700 shadow"
            >
              + Post Ad
            </button>

          </div>
        </div>
      </header>


      {/* HERO */}
      <section className="bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">

          <div className="mx-auto max-w-3xl text-center text-white">

            <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur">
              🇱🇰 Sri Lanka&apos;s Personal Ads
            </div>

            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Meet Someone Special
            </h1>

            <p className="mt-3 text-base text-white/80 sm:text-lg">
              Connect with people across Sri Lanka.
            </p>


            {/* SEARCH */}
            <div className="mt-7 rounded-2xl bg-white p-2 shadow-2xl">

              <div className="flex flex-col gap-2 sm:flex-row">

                <div className="flex flex-1 items-center rounded-xl border border-gray-200 px-4">

                  <span className="mr-3 text-xl">
                    🔍
                  </span>

                  <input
                    type="text"
                    placeholder="Search personal ads..."
                    className="w-full bg-transparent py-3 text-sm text-gray-800 outline-none"
                  />

                </div>

                <button
                  type="button"
                  className="rounded-xl bg-purple-600 px-7 py-3 font-bold text-white hover:bg-purple-700"
                >
                  Search
                </button>

              </div>


              {/* LOCATION */}
              <div className="mt-2 flex items-center px-3 pb-1">

                <span className="mr-2">
                  📍
                </span>

                <select className="w-full bg-transparent text-sm text-gray-500 outline-none">

                  {districts.map((district) => (
                    <option key={district}>
                      {district}
                    </option>
                  ))}

                </select>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-8">

        <div className="mb-5">

          <h2 className="text-xl font-bold sm:text-2xl">
            Browse Personal Ads
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Find people based on what you are looking for.
          </p>

        </div>


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">

          {categories.map((category) => (

            <button
              key={category.name}
              type="button"
              className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-md"
            >

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-2xl">
                {category.icon}
              </div>

              <div className="mt-3 text-sm font-bold">
                {category.name}
              </div>

            </button>

          ))}

        </div>

      </section>


      {/* FEATURED PERSONAL ADS */}
      <section className="mx-auto max-w-7xl px-4 py-5">

        <div className="mb-5 flex items-end justify-between">

          <div>

            <div className="flex items-center gap-2">

              <span className="text-xl">
                ⭐
              </span>

              <h2 className="text-xl font-bold sm:text-2xl">
                Featured Personal Ads
              </h2>

            </div>

            <p className="mt-1 text-sm text-gray-500">
              Popular personal ads
            </p>

          </div>

          <button
            type="button"
            className="text-sm font-semibold text-purple-600"
          >
            See All →
          </button>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {personalAds.map((ad) => (

            <div
              key={ad.name}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* PHOTO */}
              <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 text-8xl">

                {ad.emoji}

                <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-bold text-gray-900">
                  FEATURED
                </span>

                <button
                  type="button"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow"
                >
                  ♡
                </button>

              </div>


              {/* INFO */}
              <div className="p-4">

                <div className="flex items-center justify-between">

                  <h3 className="text-lg font-bold">
                    {ad.name}, {ad.age}
                  </h3>

                  <span className="text-xs text-green-600">
                    ● Online
                  </span>

                </div>


                <div className="mt-2 text-sm text-gray-500">
                  📍 {ad.district}
                </div>


                <div className="mt-2 inline-block rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-600">
                  {ad.category}
                </div>


                <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                  {ad.text}
                </p>


                <button
                  type="button"
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-2.5 text-sm font-bold text-white"
                >
                  View Profile
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-10">

        <div className="text-center">

          <h2 className="text-2xl font-bold">
            How Lanka Meet Works
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Simple and easy to connect with people.
          </p>

        </div>


        <div className="mt-7 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="text-4xl">
              📝
            </div>

            <h3 className="mt-3 font-bold">
              Create Account
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Register your account to use Lanka Meet.
            </p>
          </div>


          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="text-4xl">
              📢
            </div>

            <h3 className="mt-3 font-bold">
              Post Your Ad
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Create your personal advertisement.
            </p>
          </div>


          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="text-4xl">
              💬
            </div>

            <h3 className="mt-3 font-bold">
              Connect
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Discover and connect with other users.
            </p>
          </div>

        </div>

      </section>


      {/* POST AD CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-10">

        <div className="rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 px-6 py-10 text-center text-white shadow-lg">

          <div className="text-4xl">
            💕
          </div>

          <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            Looking to meet someone?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-white/80">
            Create your personal ad and let people know what you are looking for.
          </p>

          <button
            type="button"
            className="mt-5 rounded-xl bg-white px-7 py-3 font-bold text-purple-700 shadow"
          >
            + Post Personal Ad
          </button>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <div>
            <span className="font-bold text-gray-800">
              Lanka Meet
            </span>
            {" "}🇱🇰 Sri Lanka Personal Ads
          </div>

          <div>
            © 2026 Lanka Meet. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}
