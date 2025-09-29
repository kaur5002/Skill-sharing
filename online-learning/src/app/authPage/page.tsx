"use client";

import { useState } from 'react';
import { Users, BookOpen, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function AuthPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const closeAuth = () => {
    setShowAuth(false);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">SkillShare</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => openAuth('login')}
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
              <Button
                onClick={() => openAuth('signup')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Learn from the best,</span>
              <span className="block text-blue-600">teach what you love</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
              Join thousands of learners and tutors in our community. Share knowledge, gain skills, and grow together.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 px-4">
              <Button
                size="lg"
                onClick={() => openAuth('signup')}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 w-full sm:w-auto"
              >
                <Users className="w-5 h-5 mr-2" />
                Join as Learner
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openAuth('signup')}
                className="text-lg px-8 py-3 w-full sm:w-auto"
              >
                <Award className="w-5 h-5 mr-2" />
                Become a Tutor
              </Button>
              <Link href="/firstPage" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3 w-full"
                >
                  Continue as Guest
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to learn and teach
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Expert Tutors</CardTitle>
                  <CardDescription>
                    Learn from industry professionals and experienced educators who are passionate about sharing their knowledge.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Flexible Learning</CardTitle>
                  <CardDescription>
                    Study at your own pace with our flexible scheduling system. Learn when it's convenient for you.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Certified Skills</CardTitle>
                  <CardDescription>
                    Earn certificates and build your portfolio with verified skills that employers recognize.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Trusted by learners worldwide</h2>
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

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start learning?</span>
            <span className="block text-blue-200">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => openAuth('signup')}
                className="bg-white text-blue-600 hover:bg-gray-50"
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-2xl font-bold text-white">SkillShare</span>
            </div>
            <p className="mt-4 text-gray-400">
              Empowering learners and educators worldwide
            </p>
            <p className="mt-2 text-sm text-gray-500">
              © 2024 SkillShare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto">
            <AuthForm mode={authMode} onModeChange={toggleAuthMode} onClose={closeAuth} />
          </div>
        </div>
      )}
    </div>
  );
}