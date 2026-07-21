import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import cloudinary from "@/app/lib/cloudinary";


const MAX_SIZE = 4 * 1024 * 1024;

function userFolder(userId: string) {
  return `portfolio-images/${userId}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/") || file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Must be an image under 4MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

   
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: userFolder(session.user.id),
              transformation: [
                { width: 1600, crop: "limit" },
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            (err, res) => (err || !res ? reject(err) : resolve(res))
          )
          .end(buffer);
      }
    );

    return NextResponse.json(
      { success: true, message: "Image uploaded", url: result.secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { url } = await req.json();

    if (typeof url !== "string" || !url) {
      return NextResponse.json(
        { success: false, message: "No image URL provided" },
        { status: 400 }
      );
    }

    
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    const publicId = match?.[1];

    
    if (!publicId || !publicId.startsWith(`${userFolder(session.user.id)}/`)) {
      return NextResponse.json(
        { success: false, message: "Not an image you can delete" },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId, { invalidate: true });

    return NextResponse.json(
      { success: true, message: "Image deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Image delete error:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
