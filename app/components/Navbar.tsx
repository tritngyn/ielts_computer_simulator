"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Home,
  User,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/reading", label: "Reading", icon: BookOpen },
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/writing", label: "Writing", icon: PenTool },
  { href: "/speaking", label: "Speaking", icon: Mic },
  { href: "/profile", label: "Profile", icon: User },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 select-none">
      {/* Paper strip background */}
      <div
        className="relative bg-paper-kraft shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
        style={{ transform: "rotate(-0.3deg)", transformOrigin: "center" }}
      >
        {/* Tape decorations */}
        <div className="tape tape-yellow absolute -top-2 left-8 rotate-[-12deg]" />
        <div className="tape tape-blue absolute -top-2 right-12 rotate-[8deg]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className="flex items-center justify-between h-16"
            style={{ transform: "rotate(0.3deg)" }}
          >
            {/* Logo */}
            <Link
              href="/"
              className="font-hand text-2xl text-text-heading tracking-wide hover:rotate-[-1deg] transition-transform duration-200"
            >
              ✏️ IELTS Master
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative flex items-center gap-1.5 px-4 py-2 rounded-sm
                      font-hand text-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-paper-white shadow-[3px_3px_0px_rgba(0,0,0,0.12)] text-text-heading -rotate-1"
                          : "text-text-secondary hover:text-text-heading hover:bg-paper-white/60 hover:-translate-y-0.5"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-heading"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-paper-kraft border-t border-amber-200/50 shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-sm
                    font-hand text-lg transition-all duration-150
                    ${
                      isActive
                        ? "bg-paper-white shadow-[3px_3px_0px_rgba(0,0,0,0.1)] text-text-heading"
                        : "text-text-secondary hover:bg-paper-white/50 hover:text-text-heading"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
