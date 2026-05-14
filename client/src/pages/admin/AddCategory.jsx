import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from 'lucide-react';
import api from "../../services/api";
import toast from "react-hot-toast";

export default function AddCategory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);

    try {
      await api.post("/categories/add", { name });
      toast.success("Category added successfully!");
      navigate("/admin/dashboard/categories");
    } catch (error) {
      toast.error("Failed to add category. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate("/admin/dashboard/categories")}
          className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:text-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-2xl p-8">
          <h2 className="text-3xl font-heading font-bold mb-8 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">
            Add New Category
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-sm">Category Name *</label>
              <input
                type="text"
                value={name}
                placeholder="e.g. Electrician, Plumbing, etc."
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition shadow ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
