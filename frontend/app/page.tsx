"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Engi<span className="text-blue-500">Track</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <UserPlus size={16} />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Secure Subscription-Based{" "}
            <span className="text-blue-600">Engineering Platform</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Welcome to Engitrack. A secure desktop engineering software package
            designed for civil engineers. Manage structural projects, customize
            roles, and enjoy subscription-based flexibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-base shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-base shadow-sm"
                >
                  Get Started
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-base shadow-sm"
                >
                  Create Free Account
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
