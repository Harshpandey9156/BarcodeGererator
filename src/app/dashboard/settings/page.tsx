"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Barcode,
  AlertCircle,
  LayoutTemplate,
  SunMoon,
  ImageDown,
  Undo2,
} from "lucide-react";

export default function SettingsPage() {
  const [defaultFormat, setDefaultFormat] = useState("CODE128");
  const [duplicateAlert, setDuplicateAlert] = useState(true);
  const [layout, setLayout] = useState("standard");
  const [theme, setTheme] = useState("auto");
  const [exportQuality, setExportQuality] = useState("standard");

  useEffect(() => {
    setDefaultFormat(localStorage.getItem("defaultFormat") || "CODE128");
    setDuplicateAlert(localStorage.getItem("duplicateAlert") !== "false");
    setLayout(localStorage.getItem("layout") || "standard");
    setTheme(localStorage.getItem("theme") || "auto");
    setExportQuality(localStorage.getItem("exportQuality") || "standard");
  }, []);

  const handleSave = () => {
    localStorage.setItem("defaultFormat", defaultFormat);
    localStorage.setItem("duplicateAlert", String(duplicateAlert));
    localStorage.setItem("layout", layout);
    localStorage.setItem("theme", theme);
    localStorage.setItem("exportQuality", exportQuality);
    alert("✅ Settings saved successfully!");
  };

  const handleReset = () => {
    setDefaultFormat("CODE128");
    setDuplicateAlert(true);
    setLayout("standard");
    setTheme("auto");
    setExportQuality("standard");

    localStorage.removeItem("defaultFormat");
    localStorage.removeItem("duplicateAlert");
    localStorage.removeItem("layout");
    localStorage.removeItem("theme");
    localStorage.removeItem("exportQuality");

    alert("🔄 Settings reset to default.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* Sidebar */}
        <div className="bg-blue-900 text-white p-6 flex flex-col gap-8">
          <div className="flex items-center gap-3 text-2xl font-bold">
            <Settings className="w-6 h-6" />
            Settings Panel
          </div>
          <div className="text-sm text-blue-200">Customize your barcode generator preferences.</div>
        </div>

        {/* Form */}
        <div className="col-span-2 p-8 space-y-6">
          {/* Default Format */}
          <div>
            <label className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
              <Barcode className="w-5 h-5 text-indigo-600" />
              Default Barcode Format
            </label>
            <select
              value={defaultFormat}
              onChange={(e) => setDefaultFormat(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CODE128">Code 128</option>
              <option value="QR">QR Code</option>
              <option value="EAN13">EAN-13</option>
              <option value="UPC">UPC</option>
            </select>
          </div>

          {/* Duplicate Warning */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={duplicateAlert}
              onChange={() => setDuplicateAlert(!duplicateAlert)}
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="text-gray-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              Enable warning on duplicate barcode
            </label>
          </div>

          {/* Layout Option */}
          <div>
            <label className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
              <LayoutTemplate className="w-5 h-5 text-green-600" />
              Print Layout
            </label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="standard">Standard (1x1)</option>
              <option value="compact">Compact</option>
              <option value="wide">Wide</option>
            </select>
          </div>

          {/* Theme Option */}
          <div>
            <label className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
              <SunMoon className="w-5 h-5 text-orange-500" />
              Theme Preference
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Export Quality */}
          <div>
            <label className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
              <ImageDown className="w-5 h-5 text-purple-600" />
              Export Quality
            </label>
            <select
              value={exportQuality}
              onChange={(e) => setExportQuality(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="standard">Standard (72 DPI)</option>
              <option value="high">High Quality (300 DPI)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200"
            >
              Save Settings
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Undo2 className="w-5 h-5" />
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
