"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AuthRole } from "@/features/auth";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Code2, Info, Menu, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  userRole: AuthRole | null;
}

const Navbar = ({ userRole }: NavbarProps) => {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed left-1/2 top-4 z-50 w-full max-w-5xl -translate-x-1/2 px-2 sm:px-4"
    >
      <div className="rounded-2xl border border-white/20 bg-white/10 shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-200 hover:bg-white/15 dark:border-white/10 dark:bg-black/10 dark:shadow-black/20 dark:hover:bg-black/15">
        <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/logo.svg"
              alt="BitCrux"
              width={42}
              height={42}
              className="size-8 sm:size-[42px]"
            />
            <span className="text-lg font-bold tracking-wider text-amber-300 sm:text-2xl sm:tracking-widest">
              BitCrux
            </span>
          </Link>

          <div className="hidden flex-row items-center justify-center gap-x-4 md:flex">
            <Link
              href="/problems"
              className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
            >
              Problems
            </Link>

            <Link
              href="/about"
              className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
            >
              About
            </Link>

            <Link
              href="/profile"
              className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
            >
              Profile
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ModeToggle />

            {isLoaded && isSignedIn && (
              <>
                <div className="flex items-center">
                  <UserButton />
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  {userRole === "ADMIN" && (
                    <Button asChild variant="outline" size="sm">
                      <Link href="/problems/create">Create Problem</Link>
                    </Button>
                  )}
                </div>
              </>
            )}

            {isLoaded && !isSignedIn && (
              <div className="hidden items-center gap-2 md:flex">
                <SignInButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium hover:bg-white/20 dark:hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton>
                  <Button
                    size="sm"
                    className="bg-amber-400 text-sm font-medium text-white hover:bg-amber-500"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Open navigation menu"
                  >
                    <Menu aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  aria-label="Navigation menu"
                >
                  <DropdownMenuLabel>Navigate</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/problems">
                      <Code2 aria-hidden="true" />
                      Problems
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about">
                      <Info aria-hidden="true" />
                      About
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserRound aria-hidden="true" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isLoaded && isSignedIn && userRole === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/problems/create">
                        <Code2 aria-hidden="true" />
                        Create Problem
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isLoaded && !isSignedIn && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/sign-in">Sign In</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/sign-up">Sign Up</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
