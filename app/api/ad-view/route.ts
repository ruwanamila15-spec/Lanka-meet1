import { NextResponse } from "next/server";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import adminApp from "../../lib/firebaseAdmin";
import { rateLimit } from "../../lib/rateLimit";

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");

    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      realIp?.trim() ||
      "unknown";

    if (!rateLimit(`ad-view:${ip}`, 30, 60 * 1000)) {
      return NextResponse.json(
        {
          error: "Too many view requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    const adId =
      typeof body?.adId === "string"
        ? body.adId.trim()
        : "";

    if (!adId || adId.length > 150) {
      return NextResponse.json(
        { error: "Invalid advertisement ID." },
        { status: 400 }
      );
    }

    const db = getFirestore(adminApp);
    const adRef = db.collection("ads").doc(adId);

    const adSnap = await adRef.get();

    if (!adSnap.exists) {
      return NextResponse.json(
        { error: "Advertisement not found." },
        { status: 404 }
      );
    }

    const adData = adSnap.data() || {};

    if (
      adData.adminApproved !== true ||
      adData.paymentStatus !== "paid"
    ) {
      return NextResponse.json(
        { error: "Advertisement is not available." },
        { status: 404 }
      );
    }

    await adRef.update({
      views: FieldValue.increment(1),
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("AD VIEW API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to update view count." },
      { status: 500 }
    );
  }
}
