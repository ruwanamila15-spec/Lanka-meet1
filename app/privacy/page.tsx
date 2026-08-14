import Link from "next/link";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Last updated: August 14, 2026
          </p>

          <div className="mt-8 space-y-6 text-gray-700">

            <section>
              <h2 className="text-xl font-bold text-black">
                1. Information We Collect
              </h2>
              <p className="mt-2">
                Lanka Meet may collect information provided by users when
                creating an account or posting a personal advertisement. This
                may include name, email address, age, district, location,
                advertisement details and profile photos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                2. How We Use Information
              </h2>
              <p className="mt-2">
                Information is used to create and manage user accounts,
                publish advertisements, provide website services, improve
                the platform and communicate with users when necessary.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                3. Personal Advertisements
              </h2>
              <p className="mt-2">
                Information that users choose to include in a personal
                advertisement may be visible to other visitors of Lanka Meet.
                Users should not publish sensitive or confidential information
                in their advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                4. Payments
              </h2>
              <p className="mt-2">
                Payments for paid advertising packages may be processed
                through third-party payment service providers. Lanka Meet
                does not intentionally store complete card numbers, CVV
                numbers or other sensitive card information on its servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                5. Data Security
              </h2>
              <p className="mt-2">
                We take reasonable measures to protect user information from
                unauthorized access, misuse or disclosure. However, no online
                service can guarantee complete security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                6. Third-Party Services
              </h2>
              <p className="mt-2">
                Lanka Meet may use services such as Firebase and payment
                providers to operate authentication, data storage, hosting
                and payment processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                7. User Responsibilities
              </h2>
              <p className="mt-2">
                Users are responsible for the information they submit to
                Lanka Meet and should avoid sharing passwords, financial
                information, identification documents or other sensitive
                information publicly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                8. Changes to This Policy
              </h2>
              <p className="mt-2">
                Lanka Meet may update this Privacy Policy from time to time.
                Updated versions will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black">
                9. Contact
              </h2>
              <p className="mt-2">
                If you have questions about this Privacy Policy, please
                contact Lanka Meet through the contact information provided
                on the website.
              </p>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}
