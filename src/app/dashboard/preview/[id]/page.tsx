"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

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

export default function BarcodePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? parseInt(params.id) : null;

  const [barcode, setBarcode] = useState<Barcode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/barcodes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Barcode not found");
        return res.json();
      })
      .then((data) => setBarcode(data))
      .catch(() => router.push("/dashboard/history"))
      .finally(() => setLoading(false));
  }, [id, router]); // ✅ include router

  const markAsPrinted = async () => {
    if (!barcode || barcode.status === "Printed") return;
    await fetch("/api/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: barcode.id, status: "Printed" }),
    });
    setBarcode({ ...barcode, status: "Printed" });
  };

  const handleDownloadPNG = async () => {
    const container = document.getElementById("barcode-preview");
    if (!container) return;
    const canvas = await html2canvas(container);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `barcode-${barcode?.generatedId}.png`;
    link.click();
    await markAsPrinted();
  };

  const goToPrev = () => {
    if (id && id > 1) {
      router.push(`/dashboard/preview/${id - 1}`);
    }
  };

  const goToNext = () => {
    if (id) {
      router.push(`/dashboard/preview/${id + 1}`);
    }
  };

  const isValidEAN13 = (input: string) => /^\d{12}$/.test(input);

  if (loading) return <div className="p-10 text-center text-gray-600">Loading...</div>;
  if (!barcode) return <div className="p-10 text-center text-red-600">Barcode not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">🔍 Barcode Preview</h1>

        <div className="space-y-2 mb-6 text-sm text-gray-600">
          <p><strong>Item:</strong> {barcode.itemName}</p>
          <p><strong>SKU:</strong> {barcode.sku}</p>
          <p><strong>Batch:</strong> {barcode.batchNo}</p>
          <p><strong>Format:</strong> {barcode.format}</p>
          <p><strong>Status:</strong>{" "}
            <span className={`font-medium ${barcode.status === "Printed" ? "text-green-600" : "text-yellow-600"}`}>
              {barcode.status}
            </span>
          </p>
          <p><strong>Created:</strong> {new Date(barcode.createdAt).toLocaleString()}</p>
        </div>

        <div
          id="barcode-preview"
          className="p-4 border bg-gray-100 flex justify-center rounded-md mb-6"
        >
          {barcode.format === "QR" ? (
            <QRCode value={barcode.generatedId} size={160} />
          ) : (
            barcode.generatedId && (
              <svg
                id="preview-barcode-svg"
                ref={(el) => {
                  if (!el) return;
                  try {
                    const id = barcode.generatedId.trim();
                    if (barcode.format === "EAN13" && !isValidEAN13(id)) {
                      throw new Error("Invalid EAN13 code");
                    }

                    JsBarcode(el, id, {
                      format: barcode.format,
                      displayValue: true,
                      height: 80,
                      width: 2,
                    });
                  } catch (e) {
                    console.error(`Barcode render error for ID ${barcode.id}`, e);
                  }
                }}
              />
            )
          )}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleDownloadPNG}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Download PNG
          </button>
          <button
            onClick={markAsPrinted}
            disabled={barcode.status === "Printed"}
            className={`px-4 py-2 rounded ${barcode.status === "Printed"
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
          >
            {barcode.status === "Printed" ? "Already Printed" : "Mark as Printed"}
          </button>
          <button
            onClick={goToPrev}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            ⬅ Previous
          </button>
          <button
            onClick={goToNext}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}
