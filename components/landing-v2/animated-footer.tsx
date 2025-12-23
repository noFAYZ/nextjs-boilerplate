"use client";
import React from "react";
import Link from "next/link";
import {
  NotepadTextDashed,
  Twitter,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

export const Footer = ({
  brandName = "YourBrand",
  brandDescription = "Your description here",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  className,
}: FooterProps) => {
  return (
    <section className={cn("relative w-full mt-0 overflow-hidden", className)}>
      <footer className=" bg-card mt-20 relative">
        <div className="max-w-7xl flex flex-col justify-between mx-auto min-h-[30rem] sm:min-h-[35rem] md:min-h-[30rem] relative p-4 py-10">
          <div className="flex flex-col mb-12 sm:mb-20 md:mb-0 w-full">
            <div className="w-full flex flex-col items-center">
        
              {socialLinks.length > 0 && (
                <div className="flex mb-8 mt-3 gap-4">
                  {socialLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-6 h-6 hover:scale-110 duration-300">
                        {link.icon}
                      </div>
                      <span className="sr-only">{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {navLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground max-w-full px-4">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      className="hover:text-foreground duration-300 hover:font-semibold"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 md:mt-24 flex flex-col gap-2 md:gap-1 items-center justify-center md:flex-row md:items-center md:justify-between px-4 md:px-0">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              ©{new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            {creatorName && creatorUrl && (
              <nav className="flex gap-4">
                <Link
                  href={creatorUrl}
                  target="_blank"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 hover:font-medium"
                >
                  made with 🧡 by {creatorName}
                </Link>
              </nav>
            )}
          </div>
        </div>

        {/* Large background text - FIXED */}
{/* Background Brand Text */}
<div className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 bottom-40 md:bottom-32 w-full px-4 z-0">
  <div
    className="
      relative text-center font-extrabold tracking-tight leading-none
      bg-clip-text text-transparent
      bg-gradient-to-b
      from-black/80
      via-black/20
      to-transparent
      dark:from-white/35
      dark:via-white/15
    "
    style={{
      fontSize: "clamp(3rem, 12vw, 10rem)",
      maxWidth: "95vw",
    }}
  >
    {brandName.toUpperCase()}

    {/* Soft glow layer */}
    <span
      aria-hidden
      className="
        absolute inset-0
        bg-clip-text text-transparent
        bg-gradient-to-b
        from-primary/30
        via-primary/10
        to-transparent
        blur-xl
        opacity-60
      "
    >
      {brandName.toUpperCase()}
    </span>
  </div>
</div>

        {/* Bottom logo */}
      {/* Bottom Floating Logo */}
<div className="pointer-events-none absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-20">
  <div
    className="
      relative flex items-center justify-center
      rounded-full
      p-[2px]
      bg-gradient-to-br from-primary/40 via-primary/20 to-transparent
      
    "
  >
    {/* Glow ring */}
    <div
      className="
        absolute inset-0 rounded-full
        blur-xl
        bg-primary/30
        dark:bg-primary/40
      "
    />

    {/* Glass container */}
    <div
      className="
        relative flex items-center justify-center
        w-16 h-16 sm:w-20 sm:h-20
        rounded-full
        backdrop-blur-xl
        bg-background/60
        border border-border/40
        shadow-[0_20px_40px_rgba(0,0,0,0.15)]
        dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)]
      "
    >
      {/* Logo */}
      <Image
        src="/logo/log.webp"
        alt="MoneyMappr logo"
        width={72}
        height={72}
        priority
        className="
          w-10 h-10 sm:w-14 sm:h-14
          object-contain
       
        "
      />
    </div>
  </div>
</div>


        {/* Bottom line */}
        <div className="absolute bottom-32 sm:bottom-34 backdrop-blur-sm h-1 bg-gradient-to-r from-transparent via-border to-transparent w-full left-1/2 -translate-x-1/2"></div>

        {/* Bottom shadow */}
        <div className="bg-gradient-to-t from-card via-card/80 blur-[1em] to-card/40 absolute bottom-28 w-full h-24"></div>
      </footer>
    </section>
  );
};
