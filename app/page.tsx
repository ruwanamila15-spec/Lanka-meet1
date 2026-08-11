export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-2xl hover:bg-white/10"
            >
              ☰
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">
                👥
              </div>

              <div>
                <div className="text-xl font-extrabold">
                  Lanka Meet
                </div>
                <div className="text-[10px] text-white/80">
                  Sri Lanka
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold sm:block"
            >
              Login
            </button>

            <button
              type="button"
              className="rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-purple-700 shadow-sm"
            >
              + Post Ad
            </button>
          </div>

        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Lanka Meet
          </h1>

          <p className="mt-2 text-gray-500">
            Sri Lanka&apos;s simple local ads platform
          </p>
        </div>
      </section>
    </main>
  );
}
