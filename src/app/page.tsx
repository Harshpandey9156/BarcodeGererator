"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-10 tracking-tight">
          Smart Barcode System
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/dashboard/generatebarcode">
            <div className="bg-blue-100 hover:bg-blue-200 transition-colors duration-300 rounded-xl p-5 cursor-pointer shadow-sm border border-blue-200">
              <h2 className="text-xl font-semibold text-blue-800 mb-1">Create New</h2>
              <p className="text-sm text-blue-700">Design and generate barcodes or QR codes with smart ID assistance.</p>
            </div>
          </Link>

          <Link href="/dashboard/preview/1">
            <div className="bg-green-100 hover:bg-green-200 transition-colors duration-300 rounded-xl p-5 cursor-pointer shadow-sm border border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-1">View & Download</h2>
              <p className="text-sm text-green-700">Preview the latest barcode. Save it as PNG or PDF.</p>
            </div>
          </Link>

          <Link href="/dashboard/history">
            <div className="bg-yellow-100 hover:bg-yellow-200 transition-colors duration-300 rounded-xl p-5 cursor-pointer shadow-sm border border-yellow-200">
              <h2 className="text-xl font-semibold text-yellow-800 mb-1">Saved History</h2>
              <p className="text-sm text-yellow-700">Review previously generated codes and re-use them easily.</p>
            </div>
          </Link>

          <Link href="/dashboard/settings">
            <div className="bg-purple-100 hover:bg-purple-200 transition-colors duration-300 rounded-xl p-5 cursor-pointer shadow-sm border border-purple-200">
              <h2 className="text-xl font-semibold text-purple-800 mb-1">Preferences</h2>
              <p className="text-sm text-purple-700">Configure your default format, color, export type and AI usage.</p>
            </div>
          </Link>
        </div>

        <p className="text-center text-sm text-gray-400 mt-10">
          Designed for modular ERP environments. Powered by AI tools.
        </p>
      </div>
    </main>
  );
}
