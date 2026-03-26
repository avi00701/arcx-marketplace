import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Arc<span className="text-accent">X</span>
              </span>
            </Link>
            <p className="text-sm text-muted max-w-xs">
              The world&apos;s most advanced decentralized NFT marketplace for digital assets.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link href="/explore" className="text-sm text-muted hover:text-accent transition-colors">All NFTs</Link></li>
              <li><Link href="/explore?category=art" className="text-sm text-muted hover:text-accent transition-colors">Art</Link></li>
              <li><Link href="/explore?category=gaming" className="text-sm text-muted hover:text-accent transition-colors">Gaming</Link></li>
              <li><Link href="/explore?category=photography" className="text-sm text-muted hover:text-accent transition-colors">Photography</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/profile" className="text-sm text-muted hover:text-accent transition-colors">Profile</Link></li>
              <li><Link href="/favorites" className="text-sm text-muted hover:text-accent transition-colors">Favorites</Link></li>
              <li><Link href="/watchlist" className="text-sm text-muted hover:text-accent transition-colors">Watchlist</Link></li>
              <li><Link href="/settings" className="text-sm text-muted hover:text-accent transition-colors">Settings</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted hover:text-accent transition-colors">About</Link></li>
              <li><Link href="/careers" className="text-sm text-muted hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-sm text-muted hover:text-accent transition-colors">Blog</Link></li>
              <li><Link href="/help" className="text-sm text-muted hover:text-accent transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border gap-4">
          <p className="text-xs text-muted">
            &copy; {currentYear} ArcX Marketplace. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-muted hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-muted hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
