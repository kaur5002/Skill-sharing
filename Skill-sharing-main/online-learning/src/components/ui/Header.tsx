"use client";

import Link from "next/link";
import { BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ===========================
              🔹 LOGO + BRAND
          ============================ */}
          <Link
            href="/"
            className="flex items-center group transition-transform duration-200"
          >
            {/* Icon */}
            <BookMarked className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-200" />

            {/* Text */}
            <h1 className="ml-2 text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
              SkillShare
            </h1>
          </Link>

          {/* ===========================
              🔹 NAVIGATION BUTTONS
          ============================ */}
          <nav className="flex items-center space-x-2 ml-8">
            <Link href="/">
              <Button
                className="bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-md active:scale-[0.98]"
              >
                Join as Learner
              </Button>
            </Link>

            <Link href="/">
              <Button
                size="sm"
                variant="outline"
                className="relative group border-blue-200 hover:border-blue-500 transition-all"
              >
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 group-hover:w-full transition-all duration-200" />
                Find a Tutor
              </Button>
            </Link>

            <Link href="/review">
              <Button
                size="sm"
                variant="outline"
                className="relative group border-blue-200 hover:border-blue-500 transition-all"
              >
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 group-hover:w-full transition-all duration-200" />
                Ratings & Reviews
              </Button>
            </Link>


            <Link href="/latest-videos">
              <Button
                size="sm"
                variant="outline"
                className="relative group border-blue-200 hover:border-blue-500 transition-all"
              >
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 group-hover:w-full transition-all duration-200" />
                Latest Videos
              </Button>
            </Link>



          </nav>

          {/* ===========================
              🔹 AUTH BUTTONS
          ============================ */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Sign In
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] transition-all">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
