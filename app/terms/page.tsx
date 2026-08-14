import Link from "next/link";

export default function TermsPage() {
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
            Terms & Conditions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Last updated: August 14, 2026
          </p>

          <div className="mt-8 space-y-6 text-gray-700">

            <section>
              <h2 className="text-xl font-bold text-black">
                1. Acceptance of Terms
              </h2>
              <p className="mt-2">
                By accessing or using Lanka Meet, you agree to these Terms &
                Conditions. If you do not agree with these terms, please do
                not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                2. Eligibility
              </h2>
              <p className="mt-2">
                Lanka Meet is intended for adults aged 18 years or older.
                Users must provide accurate information when creating an
                account or posting an advertisement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                3. User Accounts
              </h2>
              <p className="mt-2">
                Users are responsible for keeping their account information
                secure and for all activity performed through their account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                4. Personal Ads
              </h2>
              <p className="mt-2">
                Users are responsible for the content they submit. Ads must
                not contain illegal, fraudulent, abusive, misleading or
                inappropriate content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                5. Prohibited Content
              </h2>
              <p className="mt-2">
                Users must not use Lanka Meet to publish scams, impersonation,
                harassment, threats, illegal services, sexually exploitative
                content or content that violates applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                6. Advertisement Review
              </h2>
              <p className="mt-2">
                Lanka Meet may review, reject, edit or remove advertisements
                that violate these Terms & Conditions or applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                7. Paid Packages
              </h2>
              <p className="mt-2">
                Paid advertising packages may provide different durations,
                visibility and promotional features. Package details and
                prices are displayed before payment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                8. Payments
              </h2>
              <p className="mt-2">
                Payments may be processed through third-party payment
                providers. Users must provide accurate payment information
                when completing a transaction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                9. Suspension or Termination
              </h2>
              <p className="mt-2">
                Lanka Meet may suspend or terminate accounts or remove ads
                where there is a violation of these terms, suspected fraud,
                abuse or unlawful activity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                10. Limitation of Liability
              </h2>
              <p className="mt-2">
                Lanka Meet provides an online platform for users to publish
                and discover personal advertisements. Users are responsible
                for their own interactions and decisions when communicating
                with other users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                11. Changes to These Terms
              </h2>
              <p className="mt-2">
                These Terms & Conditions may be updated from time to time.
                Changes will be published on this page.
              </p>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}
