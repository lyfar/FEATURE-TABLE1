"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/layouts/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/layouts/main-nav";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-3">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
