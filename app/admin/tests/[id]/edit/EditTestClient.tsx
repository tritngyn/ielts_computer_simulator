"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Edit3 } from "lucide-react";
import { updateTestAction } from "@/lib/admin-actions";
import { IeltsReadingTest } from "@/types/ielts";

export default function EditTestClient({ testData }: { testData: IeltsReadingTest }) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(testData, null, 2));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!jsonInput.trim()) {
      setError("Please provide JSON data.");
      return;
    }

    setIsSubmitting(true);
    const res = await updateTestAction(testData.id, jsonInput);
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/admin/tests");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/tests" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tests
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-blue-600" /> Edit Test: {testData.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Modify the JSON representation of the `IeltsReadingTest` here.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Raw JSON Data</label>
              <textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                spellCheck={false}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/tests" className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : <><Save className="w-5 h-5" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
