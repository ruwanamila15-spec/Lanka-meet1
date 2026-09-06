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

type PackageData = {
  id: string;
  name: string;
  price: number;
  description: string;
  enabled: boolean;
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [message, setMessage] = useState("");

  const loadPackages = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "packages"));

      const list: PackageData[] = snapshot.docs.map((item) => {
        const data = item.data();

        return {
          id: item.id,
          name: data.name || "",
          price: Number(data.price || 0),
          description: data.description || "",
          enabled: data.enabled !== false,
        };
      });

      list.sort((a, b) => a.price - b.price);

      setPackages(list);
    } catch (error) {
      console.error("ADMIN PACKAGES LOAD ERROR:", error);
      setMessage("❌ Unable to load packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const addPackage = async () => {
    setMessage("");

    if (!name.trim()) {
      setMessage("❌ Please enter package name.");
      return;
    }

    if (!price.trim() || Number(price) < 0) {
      setMessage("❌ Please enter a valid price.");
      return;
    }

    if (!description.trim()) {
      setMessage("❌ Please enter package description.");
      return;
    }

    try {
      setActionId("add");

      await addDoc(collection(db, "packages"), {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        enabled: true,
        createdAt: new Date().toISOString(),
      });

      setName("");
      setPrice("");
      setDescription("");

      setMessage("✅ Package added successfully.");

      await loadPackages();
    } catch (error) {
      console.error("ADD PACKAGE ERROR:", error);
      setMessage("❌ Failed to add package.");
    } finally {
      setActionId("");
    }
  };

  const startEdit = (item: PackageData) => {
    setEditingId(item.id);
    setEditingName(item.name);
    setEditingPrice(String(item.price));
    setEditingDescription(item.description);
    setMessage("");
  };

  const saveEdit = async (item: PackageData) => {
    if (!editingName.trim()) {
      setMessage("❌ Package name is required.");
      return;
    }

    if (!editingPrice.trim() || Number(editingPrice) < 0) {
      setMessage("❌ Enter a valid price.");
      return;
    }

    if (!editingDescription.trim()) {
      setMessage("❌ Description is required.");
      return;
    }

    try {
      setActionId(item.id);

      await updateDoc(doc(db, "packages", item.id), {
        name: editingName.trim(),
        price: Number(editingPrice),
        description: editingDescription.trim(),
      });

      setEditingId("");
      setMessage("✅ Package updated successfully.");

      await loadPackages();
    } catch (error) {
      console.error("UPDATE PACKAGE ERROR:", error);
      setMessage("❌ Failed to update package.");
    } finally {
      setActionId("");
    }
  };

  const togglePackage = async (item: PackageData) => {
    const newEnabled = !item.enabled;

    if (
      !confirm(
        `${newEnabled ? "Enable" : "Disable"} "${item.name}" package?`
      )
    ) {
      return;
    }

    try {
      setActionId(item.id);

      await updateDoc(doc(db, "packages", item.id), {
        enabled: newEnabled,
      });

      setMessage(
        newEnabled
          ? "✅ Package enabled."
          : "⏸️ Package disabled."
      );

      await loadPackages();
    } catch (error) {
      console.error("TOGGLE PACKAGE ERROR:", error);
      setMessage("❌ Failed to change package status.");
    } finally {
      setActionId("");
    }
  };

  const deletePackage = async (item: PackageData) => {
    if (
      !confirm(
        `Delete "${item.name}" permanently? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setActionId(item.id);

      await deleteDoc(doc(db, "packages", item.id));

      setMessage("🗑️ Package deleted.");

      await loadPackages();
    } catch (error) {
      console.error("DELETE PACKAGE ERROR:", error);
      setMessage("❌ Failed to delete package.");
    } finally {
      setActionId("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-purple-700 to-pink-600 px-5 py-6 text-white shadow-lg">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/admin"
            className="text-sm font-bold text-white/80 hover:text-white"
          >
            ← Admin Panel
          </Link>

          <h1 className="mt-3 text-3xl font-extrabold">
            Packages Management
          </h1>

          <p className="mt-1 text-sm text-white/80">
            Manage advertising packages and prices
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">
        {message && (
          <div className="mb-5 rounded-2xl bg-white p-4 text-sm font-bold shadow-sm">
            {message}
          </div>
        )}

        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-gray-900">
            ➕ Add Package
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Package name"
              className="rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
            />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              placeholder="Price"
              className="rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Package description"
              className="rounded-xl border border-gray-300 px-4 py-3 text-black outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="button"
            onClick={addPackage}
            disabled={actionId === "add"}
            className="mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-extrabold text-white shadow-md disabled:opacity-50"
          >
            {actionId === "add" ? "Adding..." : "➕ Add Package"}
          </button>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-900">
            📦 Packages
          </h2>

          <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
            {packages.length} Packages
          </span>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-center font-bold text-gray-500 shadow-sm">
            Loading packages...
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-extrabold text-gray-800">
              No packages found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Add your first advertising package above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl border-2 bg-white p-5 shadow-sm ${
                  item.enabled
                    ? "border-purple-100"
                    : "border-gray-200 opacity-70"
                }`}
              >
                {editingId === item.id ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(e) =>
                        setEditingName(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                    />

                    <input
                      value={editingPrice}
                      onChange={(e) =>
                        setEditingPrice(e.target.value)
                      }
                      type="number"
                      min="0"
                      className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                    />

                    <input
                      value={editingDescription}
                      onChange={(e) =>
                        setEditingDescription(e.target.value)
                      }
                      className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                    />

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(item)}
                        disabled={actionId === item.id}
                        className="flex-1 rounded-xl bg-purple-600 py-3 font-bold text-white disabled:opacity-50"
                      >
                        {actionId === item.id
                          ? "Saving..."
                          : "💾 Save"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingId("")}
                        className="rounded-xl bg-gray-200 px-4 py-3 font-bold text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                          item.enabled
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.enabled ? "ACTIVE" : "DISABLED"}
                      </span>
                    </div>

                    <div className="mt-5 text-3xl font-black text-purple-700">
                      Rs. {item.price.toLocaleString()}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-xl bg-purple-100 py-3 font-bold text-purple-700"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePackage(item)}
                        disabled={actionId === item.id}
                        className="rounded-xl bg-yellow-100 py-3 font-bold text-yellow-700 disabled:opacity-50"
                      >
                        {item.enabled
                          ? "⏸️ Disable"
                          : "▶️ Enable"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => deletePackage(item)}
                      disabled={actionId === item.id}
                      className="mt-2 w-full rounded-xl bg-red-100 py-3 font-bold text-red-700 disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
