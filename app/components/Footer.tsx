import Link from "next/link";

const footerLink =
  "text-xs text-purple-100/75 transition hover:text-white hover:underline";

export default function Footer() {
  return (
    <footer className="mt-auto overflow-hidden bg-gradient-to-br from-[#180c2b] via-[#291044] to-[#42135f] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl text-pink-200">♡</span>
            <span>
              <span className="block text-xl font-black">Lanka<span className="text-pink-300">Meet</span></span>
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-purple-200">Connections Across Sri Lanka</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-xs leading-6 text-purple-100/70">
            Discover advertisements and connections across Sri Lanka. Browse listings and connect responsibly.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-pink-200">Explore</h3>
          <div className="flex flex-col gap-3">
            <Link href="/" className={footerLink}>Home</Link>
            <Link href="/ads" className={footerLink}>All Advertisements</Link>
            <Link href="/ads?category=Girls%20Personal" className={footerLink}>Girls Personal</Link>
            <Link href="/ads?category=Boys%20Personal" className={footerLink}>Boys Personal</Link>
            <Link href="/live-cam" className={footerLink}>Live Camera</Link>
            <Link href="/post-ad" className={footerLink}>Publish an Ad</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-pink-200">Information</h3>
          <div className="flex flex-col gap-3">
            <Link href="/about" className={footerLink}>About Us</Link>
            <Link href="/privacy" className={footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={footerLink}>Terms & Conditions</Link>
            <Link href="/refund" className={footerLink}>Refund Policy</Link>
            <Link href="/delivery" className={footerLink}>Contact & Support</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-pink-200">Packages & Follow Us</h3>
          <div className="flex flex-col gap-3">
            <Link href="/post-ad" className={footerLink}>Advertisement Packages</Link>
            <Link href="/post-ad?mode=subscription" className={footerLink}>Monthly Subscriptions</Link>
          </div>
          <p className="mt-5 text-[10px] font-bold text-purple-100/60">Follow LankaMeet</p>
          <div className="mt-2 flex gap-2">
            <span aria-label="Facebook" title="Facebook page link not configured" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sm font-black">f</span>
            <span aria-label="TikTok" title="TikTok link not configured" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sm font-black">♪</span>
            <span aria-label="WhatsApp" title="WhatsApp link not configured" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sm font-black">W</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/15 px-4 py-4 text-center">
        <p className="text-[10px] text-purple-100/65">© 2026 LankaMeet. All Rights Reserved.</p>
        <p className="mt-1 text-[9px] text-purple-200/45">Made for Sri Lanka</p>
      </div>
    </footer>
  );
}
