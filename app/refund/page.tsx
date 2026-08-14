import Link from "next/link";

export default function RefundPage() {
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
            Refund & Cancellation Policy
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Last updated: August 14, 2026
          </p>

          <div className="mt-8 space-y-6 text-gray-700">

            <section>
              <h2 className="text-xl font-bold text-black">
                1. Paid Advertisement Packages
              </h2>
              <p className="mt-2">
                Payments for paid advertisement packages are made for
                promotional services provided through Lanka Meet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                2. Cancellation
              </h2>
              <p className="mt-2">
                A paid advertisement package may not be cancelled after the
                promotional service has started or the advertisement has been
                published.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                3. Refund Requests
              </h2>
              <p className="mt-2">
                Refund requests may be considered where a payment was made
                successfully but the purchased service could not be provided
                due to a technical issue caused by Lanka Meet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                4. Rejected Advertisements
              </h2>
              <p className="mt-2">
                If an advertisement is rejected because it violates our
                Terms & Conditions, a refund is not automatically guaranteed.
                Each case may be reviewed individually.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                5. Duplicate or Incorrect Payments
              </h2>
              <p className="mt-2">
                If you believe you have been charged more than once for the
                same transaction, please contact Lanka Meet with the relevant
                payment reference so the transaction can be reviewed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                6. Contact
              </h2>
              <p className="mt-2">
                Refund-related questions can be submitted through the contact
                information provided on the Lanka Meet website.
              </p>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}
