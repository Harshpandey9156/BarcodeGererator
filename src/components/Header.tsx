 
"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">
          AI Barcode Generator
        </h1>
        <nav className="flex gap-6 text-sm font-medium text-gray-700">
          <Link href="/dashboard/generatebarcode">Generate</Link>
          <Link href="/dashboard/history">History</Link>
          <Link href="/dashboard/settings">Settings</Link>
        </nav>
      </div>
    </header>
  );
}
