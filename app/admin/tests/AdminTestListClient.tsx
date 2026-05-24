"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, FileText, LayoutDashboard } from "lucide-react";
import { IeltsReadingTest } from "@/types/ielts";
import { deleteTestAction } from "@/lib/admin-actions";

export default function AdminTestListClient({ tests }: { tests: IeltsReadingTest[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test? This action cannot be undone.")) return;
    
    setIsDeleting(id);
    const res = await deleteTestAction(id);
    setIsDeleting(null);
    if (res.error) {
      alert(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Admin: Manage Tests</h1>
          </div>
          <Link href="/admin/tests/new" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-5 h-5" /> Add New Test
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Test Title</th>
                <th className="p-4 font-semibold">Test Code</th>
                <th className="p-4 font-semibold">Passages</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{test.title}</p>
                        <p className="text-sm text-gray-500">ID: {test.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{test.testCode}</td>
                  <td className="p-4 text-gray-700">{test.passages.length} passages</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/tests/${test.id}/edit`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(test.id)}
                        disabled={isDeleting === test.id}
                        className={`p-2 rounded-md transition-colors ${
                          isDeleting === test.id 
                          ? "text-gray-400 cursor-not-allowed" 
                          : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tests.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No tests found. Click "Add New Test" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
