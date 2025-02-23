"use client";

import { AlertTriangle } from "lucide-react";

export function ErrorMessage({ message }) {
  return (
    <div className="flex items-center bg-red-100 text-red-700 px-4 py-3 rounded-lg border border-red-300 max-w-md mx-auto">
      <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
      <p>{message || "Xatolik yuz berdi. Qayta urinib ko'ring."}</p>
    </div>
  );
}
