"use client";

import { useState } from "react";
import { Users, BookOpen, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header"; // ✅ Import reusable header

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  const openAuth = (mode: "login" | "signup") => {
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Reusable Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center py-32 text-center text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/education.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 max-w-3xl px-6">
          <h2 className="text-5xl font-extrabold mb-4 leading-tight">
            Learn from the <span className="text-blue-400">Best</span>
          </h2>
          <p className="mb-8 text-lg text-black-200">
            Master new skills with guidance from experienced mentors, and build your expertise at your own pace.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => openAuth("signup")}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 mt-2"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to learn and teach
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hover:shadow-lg transition-shadow rounded-lg border p-6 bg-white">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-xl font-semibold mb-2">Expert Tutors</div>
              <div className="text-gray-600">
                Learn from industry professionals and experienced educators who are passionate about sharing knowledge.
              </div>
            </div>

            <div className="hover:shadow-lg transition-shadow rounded-lg border p-6 bg-white">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-xl font-semibold mb-2">Flexible Learning</div>
              <div className="text-gray-600">
                Study at your own pace with our flexible scheduling system. Learn when it's convenient for you.
              </div>
            </div>

            <div className="hover:shadow-lg transition-shadow rounded-lg border p-6 bg-white">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-xl font-semibold mb-2">Certified Skills</div>
              <div className="text-gray-600">
                Earn certificates and build your portfolio with verified skills that employers recognize.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Trusted by learners worldwide
            </h2>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">10k+</div>
                <div className="text-gray-600">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Expert Tutors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">100+</div>
                <div className="text-gray-600">Skill Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">95%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
