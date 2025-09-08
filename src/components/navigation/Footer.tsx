// components/Footer.tsx
import Link from 'next/link';
import { gemunuLibre } from '@/ui/fonts';
import { Icon } from '@iconify/react/dist/iconify.js';

// Placeholder for social icons - you can replace these with actual icon components (e.g., from react-icons or SVGs)
const FacebookPlaceholder = () => <Icon icon="logos:facebook"  width="36" height="36" />
const InstagramPlaceholder = () => <Icon icon="skill-icons:instagram" width="36" height="36" />
const LinkedinPlaceholder = () => <Icon icon="skill-icons:linkedin" width="36" height="36" />
const BlueskyPlaceholder = () => <Icon icon="logos:bluesky" width="36" height="32" />
// New: X (Twitter) icon placeholder
const XPlaceholder = () => <Icon icon="fa6-brands:x-twitter" width="36" height="36" /> // Using a commonly available X icon

interface FooterLink {
  href: string;
  label: string;
}

const footerNavLinks: FooterLink[] = [
  { href: "/about", label: "ABOUT" },
    { href: "/resources", label: "RESOURCES" },
    { href: "/projects", label: "PROJECTS" },
  { href: "/updates", label: "UPDATES" },
  { href: "/contact", label: "CONTACT" },
];

// Example social links - update with your actual URLs
const socialLinks = [
  { href: "https://www.facebook.com/planetpatch.dev/", icon: FacebookPlaceholder, label: "Facebook" },
    { href: "https://www.instagram.com/planetpatch.dev/", icon: InstagramPlaceholder, label: "Instagram" },
    { href: "https://bsky.app/profile/planetpatch.bsky.social", icon: BlueskyPlaceholder, label: "BlueSky" },
  { href: "https://www.linkedin.com/company/planetpatch/", icon: LinkedinPlaceholder, label: "LinkedIn" },
  // New: X (Twitter) link
  { href: "https://x.com/PlanetPatchDev", icon: XPlaceholder, label: "X (Twitter)" },
];

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
      <div className="container mx-auto px-6 py-12 md:py-16">
        {/* Top section: Navigation Links */}
        <nav className="mb-8 md:mb-10">
          <ul className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 md:gap-x-8">
            {footerNavLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`${gemunuLibre.className} text-lg hover:text-green-600 dark:hover:text-green-400 transition-colors duration-150`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex justify-center items-center space-x-5 md:space-x-6 mb-8 md:mb-10">
          
        </div>

        {/* Middle section: Social Media Icons */}
        <div className="flex justify-center items-center space-x-5 md:space-x-6 mb-8 md:mb-10">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-150"
            >
                <social.icon/>
            </a>
          ))}
        </div>

        {/* Bottom section: Copyright */}
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} PlanetPatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
