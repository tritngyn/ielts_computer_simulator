"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Home,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { logout } from "../(auth)/actions";
import type { User as SupabaseUser } from "@supabase/supabase-js";


interface NavbarProps {
  user: SupabaseUser | null;
}

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/reading", label: "Reading", icon: BookOpen },
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/writing", label: "Writing", icon: PenTool },
  { href: "/speaking", label: "Speaking", icon: Mic },
];

const Navbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar completely on test-taking pages
  if (pathname.endsWith("/take")) {
    return null;
  }

  // The Homepage has its own transparent navbar if we want, but we can also use this global one
  // Since we redesigned the Homepage to be integrated, let's use the global one but make it transparent.
  const isHome = pathname === "/";
  const isDarkBg = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 select-none transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-black/5 py-4 shadow-sm" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`text-3xl tracking-tight font-display hover:opacity-80 transition-opacity ${isDarkBg ? 'text-white' : 'text-foreground'}`}
          >
            IELTS Master<sup className="text-xs">®</sup>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? (isDarkBg ? "text-white font-semibold" : "text-foreground font-medium")
                      : (isDarkBg ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground")
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className={`w-px h-4 mx-2 hidden lg:block ${isDarkBg ? 'bg-white/20' : 'bg-border'}`} />

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 group"
                  title="Go to Profile"
                >
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 rounded-full border border-border object-cover group-hover:border-foreground transition-colors"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${isDarkBg ? 'bg-white/10 text-white border-white/20 group-hover:border-white' : 'bg-secondary text-foreground border-border group-hover:border-foreground'}`}>
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    window.location.href = "/login";
                  }}
                  className={`transition-colors ${isDarkBg ? 'text-white/70 hover:text-red-400' : 'text-muted-foreground hover:text-red-400'}`}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`rounded-full px-6 py-2 text-sm hover:scale-[1.03] transition-transform ${isDarkBg ? 'bg-white/10 text-white border border-white/20 backdrop-blur-sm' : 'liquid-glass text-foreground'}`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 ${isDarkBg ? 'text-white' : 'text-foreground'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-black/5 shadow-2xl">
          <div className="px-4 py-4 space-y-1">
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
                    flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150
                    ${
                      isActive
                        ? "bg-black/5 text-foreground"
                        : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            <div className="h-px bg-border my-4" />

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground hover:bg-black/5 hover:text-foreground transition-all duration-150"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await logout();
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-400 hover:bg-red-950/30 transition-all duration-150"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="px-4 py-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full justify-center liquid-glass rounded-full px-6 py-3 text-sm text-foreground"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
