"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "react-qr-code";
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  itemName: string;
  sku: string;
  batchNo: string;
  format: string;
}

export default function GenerateBarcodePage() {
  const { register, watch, handleSubmit, reset } = useForm<FormData>();
  const itemName = watch("itemName");
  const sku = watch("sku");
  const batchNo = watch("batchNo");
  const format = watch("format");

  const barcodeRef = useRef<SVGSVGElement>(null);
  const [generatedId, setGeneratedId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!itemName && !sku && !batchNo) return;

    const id = `${itemName || ""}-${sku || ""}-${batchNo || ""}`;
    setGeneratedId(id);

    if (!format || !barcodeRef.current) return;

    const numericId = id.replace(/\D/g, "");

    if (format === "EAN13") {
      if (numericId.length !== 12) {
        setError("EAN-13 requires exactly 12 digits.");
        return;
      } else {
        setError("");
      }
    }

    if (format === "UPC") {
      if (numericId.length !== 11) {
        setError("UPC requires exactly 11 digits.");
        return;
      } else {
        setError("");
      }
    }

    if (format === "QR") {
      setError("");
      return;
    }

    if (numericId === "") {
      setError("Cannot render empty barcode.");
      return;
    }

    try {
      JsBarcode(barcodeRef.current, numericId, {
        format,
        displayValue: true,
        width: 2,
        height: 100,
      });
      setError("");
    } catch (err) {
      console.error("JsBarcode error:", err);
      setError("Invalid format or data.");
    }
  }, [itemName, sku, batchNo, format]);

  const onSubmit = async (data: FormData) => {
    const id = `${data.itemName}-${data.sku}-${data.batchNo}`;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, generatedId: id }),
    });

    if (res.status === 409) {
      toast.error("Duplicate barcode detected!");
    } else if (res.ok) {
      toast.success("Barcode saved successfully!");
      reset(); // reset the form fields
      setGeneratedId(""); // clear preview
    } else {
      toast.error("Failed to save barcode.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b32] to-[#362c5a] px-4 py-10 flex justify-center items-start">
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Barcode Configuration</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Format</label>
            <select
              {...register("format")}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Format</option>
              <option value="CODE128">Code128</option>
              <option value="QR">QR Code</option>
              <option value="EAN13">EAN-13</option>
              <option value="UPC">UPC</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              {...register("itemName")}
              placeholder="Item Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <label className="block text-sm font-medium text-gray-700">SKU(Number)</label>
            <input
              type="number"
              {...register("sku")}
              placeholder="SKU"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <label className="block text-sm font-medium text-gray-700">Batch No</label>
            <input
              {...register("batchNo")}
              placeholder="Batch Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition"
            >
              Generate Barcode
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview</h2>
          <div className="bg-gray-100 rounded-md p-6 h-full flex flex-col items-center justify-center">
            {generatedId && (
              <>
                {format === "QR" ? (
                  <QRCode value={generatedId} size={128} />
                ) : (
                  <svg ref={barcodeRef} className="w-full max-w-xs h-auto" />
                )}
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                <p className="mt-2 text-gray-700 font-mono text-sm text-center">
                  {generatedId}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
