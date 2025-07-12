"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";
import { Download, RefreshCcw } from "lucide-react";

interface Barcode {
  id: number;
  itemName: string;
  sku: string;
  batchNo: string;
  format: string;
  generatedId: string;
  createdAt: string;
  status?: "Printed" | "Unprinted";
}

const isValidBarcode = (format: string, value: string) => {
  const cleaned = value?.trim() || "";
  if (!cleaned) return false;

  if (format === "EAN13") return /^\d{12}$/.test(cleaned);
  if (format === "UPC") return /^\d{11,12}$/.test(cleaned);
  return cleaned.length > 0;
};

export default function BarcodeHistoryPage() {
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBarcodes();
  }, []);

  const fetchBarcodes = async () => {
    const res = await fetch("/api/barcodes");
    const data = await res.json();
    setBarcodes(data);
  };

  const filteredBarcodes = barcodes.filter((b) =>
    b.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.generatedId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = async (id: number, status: "Printed" | "Unprinted") => {
    await fetch("/api/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchBarcodes();
  };

  const markAsPrinted = async (id: number) => {
    await updateStatus(id, "Printed");
  };

  const handleExportCSV = () => {
    const csvRows = [
      ["Item Name", "SKU", "Batch No", "Format", "Generated ID", "Status", "Created"],
      ...barcodes.map((b) => [
        b.itemName,
        b.sku,
        b.batchNo,
        b.format,
        b.generatedId,
        b.status || "Unprinted",
        new Date(b.createdAt).toLocaleString(),
      ]),
    ];
    const blob = new Blob([csvRows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "barcodes.csv";
    link.click();
  };

  const exportSinglePNG = async (b: Barcode) => {
    const containerId = `export-container-${b.id}`;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.style.display = "block";
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(container);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `barcode-${b.generatedId}.png`;
      link.click();
      await markAsPrinted(b.id);
    } catch (err) {
      console.error("Export PNG Error:", err);
    }

    container.style.display = "none";
  };

  const exportSingleSVG = async (b: Barcode) => {
    if (b.format === "QR") return;
    const svg = document.getElementById(`barcode-svg-${b.id}`);
    if (!svg) return;

    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `barcode-${b.generatedId}.svg`;
    link.click();
    await markAsPrinted(b.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📦 Barcode History</h1>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Item, SKU or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchBarcodes}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1"
            >
              <RefreshCcw size={16} /> Refresh
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBarcodes.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No matching barcodes found.</p>
          ) : (
            filteredBarcodes.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow-md p-5 space-y-3 relative border border-gray-200"
              >
                <h2 className="font-bold text-lg text-gray-800">{b.itemName}</h2>
                <p className="text-sm text-gray-500">SKU: {b.sku}</p>
                <p className="text-sm text-gray-500">Batch: {b.batchNo}</p>
                <p className="text-sm text-gray-500">Format: {b.format}</p>

                <div className="bg-gray-50 border rounded-lg p-3 max-h-36 overflow-hidden flex justify-center items-center">
                  {b.format === "QR" ? (
                    <QRCode value={b.generatedId} size={100} />
                  ) : isValidBarcode(b.format, b.generatedId) ? (
                    <svg
                      id={`barcode-svg-${b.id}`}
                      className="w-full max-w-full h-auto object-contain"
                      ref={(el) => {
                        if (el) {
                          try {
                            let id = b.generatedId.trim();
                            if (["UPC", "EAN13"].includes(b.format)) {
                              id = id.replace(/\D/g, "");
                            }
                            JsBarcode(el, id, {
                              format: b.format,
                              displayValue: false,
                              width: 2,
                              height: 80,
                            });
                          } catch (err) {
                            console.error(`Error rendering barcode for ${b.id}`, err);
                          }
                        }
                      }}
                    />
                  ) : (
                    <p className="text-xs text-red-500">⚠ Invalid barcode for format {b.format}</p>
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  Created: {new Date(b.createdAt).toLocaleString()}
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <button
                    onClick={() =>
                      updateStatus(b.id, b.status === "Printed" ? "Unprinted" : "Printed")
                    }
                    className={`px-3 py-1 rounded ${b.status === "Printed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                      }`}
                  >
                    {b.status || "Unprinted"}
                  </button>

                  <Link
                    href={`/dashboard/preview/${b.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Preview
                  </Link>

                  <button
                    onClick={() => exportSinglePNG(b)}
                    className="text-green-600 hover:underline"
                  >
                    PNG
                  </button>

                  <button
                    onClick={() => exportSingleSVG(b)}
                    className="text-purple-600 hover:underline"
                  >
                    SVG
                  </button>
                </div>

                {/* Hidden Export Container */}
                <div
                  id={`export-container-${b.id}`}
                  className="absolute left-[-9999px] top-[-9999px]"
                >
                  {b.format === "QR" ? (
                    <QRCode value={b.generatedId} size={128} />
                  ) : isValidBarcode(b.format, b.generatedId) ? (
                    <svg
                      ref={(el) => {
                        if (el) {
                          try {
                            let id = b.generatedId.trim();
                            if (["UPC", "EAN13"].includes(b.format)) {
                              id = id.replace(/\D/g, "");
                            }
                            JsBarcode(el, id, {
                              format: b.format,
                              displayValue: true,
                              width: 2,
                              height: 80,
                            });
                          } catch (err) {
                            console.error(`Export error for ${b.id}`, err);
                          }
                        }
                      }}
                    />
                  ) : (
                    <p>Invalid export</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
