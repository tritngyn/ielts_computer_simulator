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
  LogOut,
  LogIn,
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
  { href: "/profile", label: "Profile", icon: User },
];

const Navbar = ({ user }: NavbarProps) => {
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
              
              <div className="w-px h-6 bg-amber-200/50 mx-2 hidden lg:block" />
              
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-sm font-hand text-lg text-text-secondary hover:text-text-heading hover:bg-paper-white/60 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-sm font-hand text-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="font-hand text-lg text-text-secondary hover:text-text-heading transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="font-hand text-lg px-4 py-1.5 bg-accent-blue text-white rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.1)] transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
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

            <div className="h-px bg-amber-200/50 my-2" />
            
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-sm font-hand text-lg text-text-secondary hover:bg-paper-white/50 hover:text-text-heading transition-all duration-150"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-sm font-hand text-lg text-red-600 hover:bg-red-50 transition-all duration-150"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-4 py-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-hand text-lg py-2 border-2 border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-hand text-lg py-2 bg-accent-blue text-white rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                >
                  Sign Up
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
