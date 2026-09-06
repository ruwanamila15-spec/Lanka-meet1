"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const categories = [
  "Girls Personal",
  "Boys Personal",
  "Spa",
  "Friendship",
  "Marriage Ads",
  "Live Cam Service",
];

const districts = [
  "Colombo",
  "Gampaha",
  "Kandy",
  "Galle",
  "Negombo",
  "Kurunegala",
  "Matara",
  "Jaffna",
  "Kalutara",
  "Kegalle",
  "Ratnapura",
  "Badulla",
  "Matale",
  "Nuwara Eliya",
  "Anuradhapura",
  "Polonnaruwa",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Hambantota",
  "Monaragala",
  "Puttalam",
  "Mannar",
  "Vavuniya",
  "Kilinochchi",
  "Mullaitivu",
];

const defaultPackages = [
  {
    id: "normal",
    name: "Normal",
    price: 100,
    description: "Standard advertisement package",
    color: "border-blue-200 bg-blue-50",
  },
  {
    id: "premium",
    name: "Premium",
    price: 500,
    description: "Better visibility for your advertisement",
    color: "border-yellow-200 bg-yellow-50",
  },
  {
    id: "vip",
    name: "VIP",
    price: 1000,
    description: "Maximum visibility and priority placement",
    color: "border-red-200 bg-red-50",
  },
];
type PackageItem = {
  id: string;
  name: string;
  price: number;
  description?: string;
  color?: string;
  enabled?: boolean;
};

export default function PostAdPage() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [age, setAge] = useState("");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [price, setPrice] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const [packageName, setPackageName] = useState("Normal");
  const [packages, setPackages] = useState<PackageItem[]>(defaultPackages);

  const [photo, setPhoto] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/login?redirect=/post-ad");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const snapshot = await getDocs(collection(db, "packages"));

        const firebasePackages: PackageItem[] = snapshot.docs
          .map((item) => {
            const data = item.data() as any;

            return {
              id: item.id,
              name: String(data.name || item.id),
              price: Number(data.price || 0),
              description: String(data.description || ""),
              color: String(
                data.color || "border-gray-200 bg-gray-50"
              ),
              enabled: data.enabled !== false,
            };
          })
          .filter((item) => item.enabled !== false)
          .sort((a, b) => a.price - b.price);

        if (firebasePackages.length > 0) {
          setPackages(firebasePackages);

          setPackageName((current) => {
            const exists = firebasePackages.some(
              (item) => item.name === current
            );

            return exists
              ? current
              : firebasePackages[0].name;
          });
        } else {
          setPackages(defaultPackages);
          setPackageName("Normal");
        }
      } catch (error) {
        console.error("PACKAGES LOAD ERROR:", error);

        setPackages(defaultPackages);
        setPackageName("Normal");
      }
    };

    loadPackages();
  }, []);

  const selectedPackage =
    packages.find((item) => item.name === packageName) ||
    packages[0] ||
    defaultPackages[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (submitting || uploading) {
      return;
    }

    setMessage("");

    if (!category) {
      setMessage("Please select a category.");
      return;
    }

    if (!title.trim()) {
      setMessage("Please enter an ad title.");
      return;
    }

    if (!age) {
      setMessage("Please enter your age.");
      return;
    }

    const ageNumber = Number(age);

    if (ageNumber < 18) {
      setMessage("You must be 18 years or older.");
      return;
    }

    if (ageNumber > 100) {
      setMessage("Please enter a valid age.");
      return;
    }

    if (!district) {
      setMessage("Please select a district.");
      return;
    }

    if (!location.trim()) {
      setMessage("Please enter your location.");
      return;
    }

    const priceNumber = Number(price.replace(/,/g, "").trim());

    if (!price.trim()) {
      setMessage("Please enter your price.");
      return;
    }

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setMessage("Please enter a valid price.");
      return;
    }

    if (!about.trim()) {
      setMessage("Please enter some details about your ad.");
      return;
    }

    /*
      MOBILE OR WHATSAPP:
      At least ONE number is required.
      Both numbers are NOT required.
    */
    const mobile = mobileNumber.trim();
    const whatsapp = whatsappNumber.trim();

    if (!mobile && !whatsapp) {
      setMessage(
        "Please enter at least one Mobile or WhatsApp number."
      );
      return;
    }

    if (!photo) {
      setMessage("Please select a photo.");
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);

      setMessage("Optimizing photo...");

      const optimizedPhoto = await new Promise<File>(
        (resolve, reject) => {
          const img = new Image();
          const canvas = document.createElement("canvas");
          const url = URL.createObjectURL(photo);

          img.onload = () => {
            URL.revokeObjectURL(url);

            const maxSize = 2000;

            let width = img.naturalWidth;
            let height = img.naturalHeight;

            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = Math.round(
                  (height * maxSize) / width
                );
                width = maxSize;
              } else {
                width = Math.round(
                  (width * maxSize) / height
                );
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            if (!ctx) {
              reject(
                new Error("Unable to process photo.")
              );
              return;
            }

            ctx.drawImage(
              img,
              0,
              0,
              width,
              height
            );

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(
                    new Error(
                      "Unable to optimize photo."
                    )
                  );
                  return;
                }

                const newFile = new File(
                  [blob],
                  "lanka-meet-photo.jpg",
                  {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  }
                );

                resolve(newFile);
              },
              "image/jpeg",
              0.88
            );
          };

          img.onerror = () => {
            URL.revokeObjectURL(url);

            reject(
              new Error(
                "Unable to read selected photo."
              )
            );
          };

          img.src = url;
        }
      );

      setMessage("Uploading photo...");

      const formData = new FormData();
      formData.append(
        "file",
        optimizedPhoto
      );

      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error(
          "Please login before uploading an image."
        );
      }

      const idToken = await currentUser.getIdToken();

      const uploadResponse = await fetch(
        "/api/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          body: formData,
        }
      );

      let uploadResult: any = null;

      try {
        uploadResult =
          await uploadResponse.json();
      } catch {
        uploadResult = null;
      }

      if (
        !uploadResponse.ok ||
        !uploadResult?.success
      ) {
        throw new Error(
          uploadResult?.error ||
            "Photo upload failed. Please try again."
        );
      }

      const photoUrl = uploadResult.url;

      if (!photoUrl) {
        throw new Error(
          "Photo URL was not returned."
        );
      }

      setUploading(false);

      setMessage(
        "Photo uploaded successfully."
      );

      const adData = {
        title: title.trim(),
        category,
        age: ageNumber,
        district,
        location: location.trim(),
        about: about.trim(),
        price: priceNumber,

        mobileNumber: mobile,
        whatsappNumber: whatsapp,

        photoUrl,
        photoName: photo.name,

        packageName: selectedPackage.name,
        packageId: selectedPackage.id,
        packagePrice: selectedPackage.price,

        status: "pending",
        paymentStatus: "pending",
        adminApproved: false,

        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "lankaMeetAd",
        JSON.stringify(adData)
      );

      localStorage.setItem(
        "lankaMeetPackage",
        JSON.stringify({
          id: selectedPackage.id,
            name: selectedPackage.name,
          price: selectedPackage.price,
        })
      );

      router.push("/payment");
    } catch (error: any) {
      console.error(
        "[browser] POST AD ERROR:",
        error
      );

      setUploading(false);
      setSubmitting(false);

      setMessage(
        error?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-purple-700 text-white shadow-lg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg">
              💕
            </div>

            <div>
              <div className="text-lg font-extrabold">
                Lanka Meet
              </div>

              <div className="text-[9px] text-white/80">
                Sri Lanka Personal Ads
              </div>
            </div>
          </Link>

          <Link
            href="/ads"
            className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-purple-700"
          >
            Browse Ads
          </Link>
        </div>
      </header>

      {/* PAGE */}
      <section className="px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-2xl">

          {/* TITLE */}
          <div className="mb-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
              📢
            </div>

            <h1 className="mt-3 text-2xl font-black">
              Post Your Personal Ad
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Create your advertisement and select a package.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-5 shadow-lg sm:p-7"
          >

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-500"
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* TITLE */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold">
                Ad Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                maxLength={100}
                placeholder="Example: Looking for friendship"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-purple-500"
              />
            </div>

            {/* AGE */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold">
                Age
              </label>

              <input
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value)
                }
                placeholder="Enter your age"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-purple-500"
              />
            </div>

            {/* DISTRICT */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold">
                District
              </label>

              <select
                value={district}
                onChange={(e) =>
                  setDistrict(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-500"
              >
                <option value="">
                  Select District
                </option>

                {districts.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Example: Colombo 05"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-purple-500"
              />
            </div>

            {/* CONTACT */}
            <div className="mt-7 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <h2 className="text-base font-black">
                Contact Details
              </h2>

              <p className="mt-1 text-[10px] text-gray-500">
                Enter at least one number. You do not need to enter both.
              </p>

              {/* MOBILE */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-bold">
                  📱 Mobile Number
                  <span className="ml-2 text-[10px] font-normal text-gray-400">
                    Optional if WhatsApp is provided
                  </span>
                </label>

                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(e.target.value)
                  }
                  placeholder="Example: 0771234567"
                  maxLength={15}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-500"
                />
              </div>

              {/* WHATSAPP */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-bold">
                  🟢 WhatsApp Number
                  <span className="ml-2 text-[10px] font-normal text-gray-400">
                    Optional if Mobile is provided
                  </span>
                </label>

                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) =>
                    setWhatsappNumber(e.target.value)
                  }
                  placeholder="Example: 0771234567"
                  maxLength={15}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-500"
                />

                <p className="mt-2 text-[10px] text-gray-500">
                  Use the number connected to WhatsApp if you provide one.
                </p>
              </div>

              <p className="mt-3 rounded-lg bg-purple-50 px-3 py-2 text-[10px] font-semibold text-purple-700">
                ℹ️ At least one of Mobile Number or WhatsApp Number is required.
              </p>
            </div>

            {/* ABOUT */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label className="mb-2 block text-sm font-bold">
                  About Your Ad
                </label>

                <span className="text-[10px] text-gray-400">
                  {about.length}/1000
                </span>
              </div>

              <textarea
                value={about}
                onChange={(e) =>
                  setAbout(e.target.value)
                }
                maxLength={1000}
                rows={6}
                placeholder="Write some details about yourself and what you are looking for..."
                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-purple-500"
              />
            </div>

                                                                  {/* PRICE */}
                                                                  <div className="mt-5">
                                                                    <label className="mb-2 block text-sm font-bold">
                                                                      💰 Your Price
                                                                    </label>
                                                                    <div className="relative">
                                                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                                                                        Rs.
                                                                      </span>
                                                                      <input
                                                                        type="number"
                                                                        min="1"
                                                                        step="1"
                                                                        value={price}
                                                                        onChange={(e) => setPrice(e.target.value)}
                                                                        placeholder="Example: 5000"
                                                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm outline-none focus:border-purple-500"
                                                                      />
                                                                    </div>
                                                                    <p className="mt-2 text-[10px] text-gray-500">
                                                                      Enter the price you want to display on your advertisement.
                                                                    </p>
                                                                  </div>

            {/* PHOTO */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold">
                Photo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0] || null;

                  if (!file) {
                    setPhoto(null);
                    return;
                  }

                  if (
                    file.size >
                    10 * 1024 * 1024
                  ) {
                    setMessage(
                      "Photo must be smaller than 10MB."
                    );

                    setPhoto(null);
                    return;
                  }

                  setMessage("");
                  setPhoto(file);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm"
              />

              {photo && (
                <div className="mt-2 rounded-xl bg-green-50 px-3 py-2">
                  <p className="text-xs font-bold text-green-600">
                    ✓ Photo Selected
                  </p>

                  <p className="mt-1 break-all text-[10px] text-gray-500">
                    {photo.name}
                  </p>
                </div>
              )}
            </div>

            {/* PACKAGE */}
            <div className="mt-7">
              <div className="mb-3">
                <label className="block text-sm font-bold">
                  Select Ad Package
                </label>

                <p className="mt-1 text-[10px] text-gray-500">
                  Select the package you want to use for your advertisement.
                </p>
              </div>

              <div className="space-y-3">
                {packages.map((item) => {
                  const selected =
                    packageName === item.name;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setPackageName(item.name)
                      }
                      className={`w-full rounded-2xl border-2 p-4 text-left transition ${
                        selected
                          ? "border-purple-600 bg-purple-50 ring-2 ring-purple-100"
                          : item.color ||
                            "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">

                        <div>
                          <div className="text-base font-black">
                            {item.name}
                          </div>

                          <div className="mt-1 text-[10px] text-gray-500">
                            {item.description ||
                              "Advertisement package"}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-black text-purple-700">
                            Rs.{" "}
                            {Number(
                              item.price || 0
                            ).toLocaleString()}
                          </div>

                          <div className="mt-1 text-[9px] font-bold">
                            {selected
                              ? "✓ Selected"
                              : "Select"}
                          </div>
                        </div>

                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SELECTED PACKAGE */}
            <div className="mt-5 rounded-2xl bg-purple-50 p-4">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-semibold text-gray-500">
                    Selected Package
                  </p>

                  <p className="mt-1 text-lg font-black text-purple-700">
                    {selectedPackage.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-semibold text-gray-500">
                    Amount
                  </p>

                  <p className="mt-1 text-xl font-black text-purple-700">
                    Rs.{" "}
                    {Number(
                      selectedPackage.price || 0
                    ).toLocaleString()}
                  </p>
                </div>

              </div>
            </div>

            {/* MESSAGE */}
            {message && (
              <div
                className={`mt-5 rounded-xl px-4 py-3 text-xs font-semibold leading-5 ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={
                submitting ||
                uploading
              }
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-4 text-sm font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? "Uploading Photo..."
                : submitting
                ? "Opening Payment..."
                : `Continue to Payment — Rs. ${Number(
                    selectedPackage.price || 0
                  ).toLocaleString()}`}
            </button>

            <p className="mt-3 text-center text-[10px] leading-5 text-gray-500">
              After submitting, your photo will be uploaded securely and you will be taken to the payment page.
            </p>

          </form>
        </div>
      </section>
    </main>
  );
}
