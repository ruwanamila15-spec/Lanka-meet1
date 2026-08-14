import Link from "next/link";

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white shadow">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <Link href="/" className="text-lg font-bold">
            ← Lanka Meet
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
          <h1 className="text-3xl font-extrabold text-black">
            Delivery & Fulfilment Policy
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Last updated: August 14, 2026
          </p>

          <div className="mt-8 space-y-6 text-gray-700">

            <section>
              <h2 className="text-xl font-bold text-black">
                1. Digital Service
              </h2>
              <p className="mt-2">
                Lanka Meet provides digital advertising and online platform
                services. We do not deliver physical products to customers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                2. Advertisement Fulfilment
              </h2>
              <p className="mt-2">
                After successful payment and any required review, the
                advertisement will be processed and made available on the
                Lanka Meet platform according to the selected advertising
                package.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                3. Processing Time
              </h2>
              <p className="mt-2">
                Advertisement processing may take some time when manual review
                or payment verification is required. The actual publication
                time may vary depending on the selected package and review
                process.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                4. Payment Verification
              </h2>
              <p className="mt-2">
                Paid advertisements may remain pending until the payment has
                been successfully verified.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                5. No Physical Delivery
              </h2>
              <p className="mt-2">
                Since Lanka Meet provides an online advertising service,
                shipping addresses and physical delivery are not required
                for advertising packages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                6. Contact
              </h2>
              <p className="mt-2">
                If you experience a problem with an advertisement after
                payment, please contact Lanka Meet using the contact
                information provided on the website.
              </p>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}
