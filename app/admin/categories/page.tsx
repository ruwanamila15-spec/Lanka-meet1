"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type Category = {
  id: string;
  name: string;
  enabled?: boolean;
  createdAt?: string;
};

const defaultCategories = [
  "Girls Personal",
  "Boys Personal",
  "Spa",
  "Friendship",
  "Marriage Ads",
  "Live Cam Service",
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "categories")
      );

      const list: Category[] = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Category, "id">),
      }));

      list.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCategories(list);
    } catch (error) {
      console.error(
        "ADMIN CATEGORIES LOAD ERROR:",
        error
      );
      setMessage("❌ Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async () => {
    const name = newName.trim();

    if (!name) {
      setMessage("Please enter a category name.");
      return;
    }

    if (
      categories.some(
        (category) =>
          category.name.toLowerCase() ===
          name.toLowerCase()
      )
    ) {
      setMessage("❌ This category already exists.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await addDoc(collection(db, "categories"), {
        name,
        enabled: true,
        createdAt: new Date().toISOString(),
      });

      setNewName("");
      setMessage("✅ Category added successfully.");
      await loadCategories();
    } catch (error) {
      console.error(
        "ADD CATEGORY ERROR:",
        error
      );
      setMessage("❌ Failed to add category.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setMessage("");
  };

  const saveEdit = async (category: Category) => {
    const name = editingName.trim();

    if (!name) {
      setMessage("Category name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await updateDoc(
        doc(db, "categories", category.id),
        {
          name,
        }
      );

      setEditingId("");
      setEditingName("");
      setMessage("✅ Category updated.");
      await loadCategories();
    } catch (error) {
      console.error(
        "UPDATE CATEGORY ERROR:",
        error
      );
      setMessage("❌ Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = async (
    category: Category
  ) => {
    try {
      setSaving(true);
      setMessage("");

      await updateDoc(
        doc(db, "categories", category.id),
        {
          enabled: category.enabled !== true,
        }
      );

      setMessage(
        category.enabled === true
          ? "Category disabled."
          : "Category enabled."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "TOGGLE CATEGORY ERROR:",
        error
      );
      setMessage(
        "❌ Failed to update category."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (
    category: Category
  ) => {
    if (
      !confirm(
        `Delete "${category.name}" permanently?`
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await deleteDoc(
        doc(db, "categories", category.id)
      );

      setMessage("🗑️ Category deleted.");
      await loadCategories();
    } catch (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );
      setMessage(
        "❌ Failed to delete category."
      );
    } finally {
      setSaving(false);
    }
  };

  const createDefaultCategories = async () => {
    try {
      setSaving(true);
      setMessage("");

      const existingNames = new Set(
        categories.map((category) =>
          category.name.toLowerCase()
        )
      );

      for (const name of defaultCategories) {
        if (!existingNames.has(name.toLowerCase())) {
          await addDoc(
            collection(db, "categories"),
            {
              name,
              enabled: true,
              createdAt:
                new Date().toISOString(),
            }
          );
        }
      }

      setMessage(
        "✅ Default categories added."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "DEFAULT CATEGORY ERROR:",
        error
      );
      setMessage(
        "❌ Failed to add default categories."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="bg-gradient-to-r from-purple-700 to-pink-600 px-5 py-6 text-white shadow-lg">
        <div className="mx-auto max-w-5xl">

          <Link
            href="/admin"
            className="text-sm font-bold text-white/80"
          >
            ← Admin Dashboard
          </Link>

          <h1 className="mt-2 text-3xl font-extrabold">
            Categories Management
          </h1>

          <p className="mt-1 text-sm text-white/80">
            Add, edit, enable, disable and delete
            categories
          </p>

        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6">

        <div className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="text-lg font-extrabold text-gray-900">
            Add New Category
          </h2>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">

            <input
              value={newName}
              onChange={(e) =>
                setNewName(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCategory();
                }
              }}
              placeholder="Example: Live Cam Service"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
            />

            <button
              onClick={addCategory}
              disabled={saving}
              className="rounded-xl bg-purple-600 px-6 py-3 font-extrabold text-white disabled:opacity-50"
            >
              ➕ Add Category
            </button>

          </div>

          <button
            onClick={createDefaultCategories}
            disabled={saving}
            className="mt-3 rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 disabled:opacity-50"
          >
            Add Missing Default Categories
          </button>

        </div>

        {message && (
          <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-bold text-gray-800 shadow-sm">
            {message}
          </div>
        )}

        <div className="mt-6">

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center font-bold text-gray-500 shadow-sm">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

              <p className="text-4xl">
                📂
              </p>

              <p className="mt-3 font-extrabold text-gray-900">
                No categories found
              </p>

              <button
                onClick={createDefaultCategories}
                disabled={saving}
                className="mt-4 rounded-xl bg-purple-600 px-5 py-3 font-extrabold text-white"
              >
                Create Default Categories
              </button>

            </div>
          ) : (
            <div className="space-y-3">

              {categories.map((category, index) => (

                <div
                  key={category.id}
                  className="rounded-2xl bg-white p-4 shadow-sm"
                >

                  {editingId === category.id ? (

                    <div className="flex flex-col gap-3 sm:flex-row">

                      <input
                        value={editingName}
                        onChange={(e) =>
                          setEditingName(
                            e.target.value
                          )
                        }
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
                      />

                      <button
                        onClick={() =>
                          saveEdit(category)
                        }
                        disabled={saving}
                        className="rounded-xl bg-green-500 px-5 py-3 font-extrabold text-white"
                      >
                        ✅ Save
                      </button>

                      <button
                        onClick={() => {
                          setEditingId("");
                          setEditingName("");
                        }}
                        className="rounded-xl bg-gray-200 px-5 py-3 font-extrabold text-gray-700"
                      >
                        Cancel
                      </button>

                    </div>

                  ) : (

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
                          📂
                        </div>

                        <div>

                          <h3 className="font-extrabold text-gray-900">
                            {category.name}
                          </h3>

                          <p className="text-xs text-gray-500">
                            Category #{index + 1}
                          </p>

                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                            category.enabled === true
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {category.enabled === true
                            ? "ENABLED"
                            : "DISABLED"}
                        </span>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        <button
                          onClick={() =>
                            startEdit(category)
                          }
                          disabled={saving}
                          className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-extrabold text-white"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleCategory(category)
                          }
                          disabled={saving}
                          className={`rounded-xl px-4 py-2 text-sm font-extrabold text-white ${
                            category.enabled === true
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                        >
                          {category.enabled === true
                            ? "⏸️ Disable"
                            : "▶️ Enable"}
                        </button>

                        <button
                          onClick={() =>
                            deleteCategory(category)
                          }
                          disabled={saving}
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-extrabold text-white"
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  )}

                </div>

              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}
