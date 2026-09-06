import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { rateLimit } from "../../lib/rateLimit";
import adminApp from "../../lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const idToken = authorization.substring(7).trim();

    if (!idToken) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }


    const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
    const rateLimitKey = `upload:${decodedToken.uid}`;

    if (!rateLimit(rateLimitKey, 5, 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many image uploads. Please try again in a minute." },
        { status: 429 }
      );
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      console.error("IMAGEKIT_PRIVATE_KEY is missing.");

      return NextResponse.json(
        { error: "Image upload is temporarily unavailable." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file received." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be between 1 byte and 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const isJpeg =
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff;

    const isPng =
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a;

    const isWebp =
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";

    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json(
        { error: "Invalid image file." },
        { status: 400 }
      );
    }

    const uploadData = new FormData();

    uploadData.append(
      "file",
      buffer.toString("base64")
    );

    uploadData.append(
      "fileName",
      `ad-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}.jpg`
    );

    uploadData.append(
      "folder",
      "/lanka-meet/ads"
    );

    uploadData.append(
      "useUniqueFileName",
      "true"
    );

    const imageKitAuth = Buffer.from(
      `${privateKey}:`
    ).toString("base64");

    const response = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${imageKitAuth}`,
        },
        body: uploadData,
      }
    );

    if (!response.ok) {
      const result = await response.json().catch(() => null);

      console.error(
        "IMAGEKIT UPLOAD ERROR:",
        response.status,
        result
      );

      return NextResponse.json(
        { error: "Image upload failed." },
        { status: 502 }
      );
    }

    const result = await response.json();

    if (!result?.url) {
      return NextResponse.json(
        { error: "Image upload failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    });
  } catch (error) {
    console.error("UPLOAD API ERROR:", error);

    return NextResponse.json(
      { error: "Unauthorized or image upload failed." },
      { status: 401 }
    );
  }
}
