"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type UserData = {
  id: string;
  uid?: string;
  name?: string;
  email?: string;
  publicUserId?: string;
  role?: string;
  createdAt?: string;
  blocked?: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "users"));

      const list: UserData[] = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<UserData, "id">),
      }));

      list.sort((a, b) =>
        (a.name || a.email || "").localeCompare(
          b.name || b.email || ""
        )
      );

      setUsers(list);
    } catch (error) {
      console.error("ADMIN USERS LOAD ERROR:", error);
      setMessage("❌ Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleBlock = async (user: UserData) => {
    const newBlocked = !user.blocked;

    const action = newBlocked ? "block" : "unblock";

    if (
      !confirm(
        `Are you sure you want to ${action} this user?`
      )
    ) {
      return;
    }

    try {
      setActionId(user.id);
      setMessage("");

      await updateDoc(doc(db, "users", user.id), {
        blocked: newBlocked,
      });

      setMessage(
        newBlocked
          ? "🚫 User blocked."
          : "✅ User unblocked."
      );

      await loadUsers();
    } catch (error) {
      console.error("BLOCK USER ERROR:", error);
      setMessage("❌ Failed to update user.");
    } finally {
      setActionId("");
    }
  };

  const deleteUserProfile = async (user: UserData) => {
    if (
      !confirm(
        "Delete this user's profile document? Firebase Authentication account will NOT be deleted."
      )
    ) {
      return;
    }

    try {
      setActionId(user.id);
      setMessage("");

      await deleteDoc(doc(db, "users", user.id));

      setMessage("User profile deleted.");
      await loadUsers();
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
      setMessage("❌ Failed to delete user profile.");
    } finally {
      setActionId("");
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "blocked") {
      return user.blocked === true;
    }

    if (filter === "active") {
      return user.blocked !== true;
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="bg-gradient-to-r from-purple-700 to-pink-600 px-5 py-6 text-white shadow-lg">
        <div className="mx-auto max-w-6xl">

          <Link
            href="/admin"
            className="text-sm font-bold text-white/80"
          >
            ← Admin Dashboard
          </Link>

          <h1 className="mt-2 text-3xl font-extrabold">
            Users Management
          </h1>

          <p className="mt-1 text-sm text-white/80">
            Manage registered Lanka Meet users
          </p>

        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">

        <div className="grid grid-cols-3 gap-3">

          <button
            onClick={() => setFilter("all")}
            className={`rounded-2xl p-4 text-left shadow-sm ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <p className="text-2xl">👥</p>
            <p className="mt-2 text-xs font-bold">
              ALL USERS
            </p>
            <p className="mt-1 text-2xl font-extrabold">
              {users.length}
            </p>
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`rounded-2xl p-4 text-left shadow-sm ${
              filter === "active"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <p className="text-2xl">✅</p>
            <p className="mt-2 text-xs font-bold">
              ACTIVE
            </p>
            <p className="mt-1 text-2xl font-extrabold">
              {
                users.filter(
                  (user) => user.blocked !== true
                ).length
              }
            </p>
          </button>

          <button
            onClick={() => setFilter("blocked")}
            className={`rounded-2xl p-4 text-left shadow-sm ${
              filter === "blocked"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <p className="text-2xl">🚫</p>
            <p className="mt-2 text-xs font-bold">
              BLOCKED
            </p>
            <p className="mt-1 text-2xl font-extrabold">
              {
                users.filter(
                  (user) => user.blocked === true
                ).length
              }
            </p>
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
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-4xl">👥</p>
              <p className="mt-3 font-extrabold text-gray-900">
                No users found
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {filteredUsers.map((user) => (

                <div
                  key={user.id}
                  className="rounded-3xl bg-white p-5 shadow-sm"
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div className="flex gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                        👤
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="text-xl font-extrabold text-gray-900">
                            {user.name || "No name"}
                          </h2>

                          {user.role === "admin" && (
                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-700">
                              ADMIN
                            </span>
                          )}

                          {user.blocked && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-extrabold text-red-700">
                              BLOCKED
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {user.email || "No email"}
                        </p>

                        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">

                          <div className="rounded-xl bg-gray-50 p-3">
                            <p className="font-bold text-gray-400">
                              Public User ID
                            </p>
                            <p className="mt-1 font-extrabold text-purple-700">
                              {user.publicUserId || "-"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-gray-50 p-3">
                            <p className="font-bold text-gray-400">
                              Created
                            </p>
                            <p className="mt-1 font-extrabold text-gray-800">
                              {user.createdAt
                                ? new Date(
                                    user.createdAt
                                  ).toLocaleDateString()
                                : "-"}
                            </p>
                          </div>

                        </div>

                        <details className="mt-3">
                          <summary className="cursor-pointer text-xs font-extrabold text-purple-600">
                            🔒 Show Admin Details
                          </summary>

                          <div className="mt-2 rounded-xl bg-purple-50 p-3 text-xs">

                            <p className="break-all">
                              <span className="font-bold">
                                UID:
                              </span>{" "}
                              {user.uid || "-"}
                            </p>

                            <p className="mt-1 break-all">
                              <span className="font-bold">
                                Document ID:
                              </span>{" "}
                              {user.id}
                            </p>

                            <p className="mt-1">
                              <span className="font-bold">
                                Role:
                              </span>{" "}
                              {user.role || "user"}
                            </p>

                          </div>
                        </details>

                      </div>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <button
                        onClick={() =>
                          toggleBlock(user)
                        }
                        disabled={actionId === user.id}
                        className={`rounded-xl px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50 ${
                          user.blocked
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      >
                        {actionId === user.id
                          ? "Working..."
                          : user.blocked
                          ? "✅ Unblock"
                          : "🚫 Block"}
                      </button>

                      <button
                        onClick={() =>
                          deleteUserProfile(user)
                        }
                        disabled={
                          actionId === user.id ||
                          user.role === "admin"
                        }
                        className="rounded-xl bg-red-500 px-4 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        🗑️ Delete Profile
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}
