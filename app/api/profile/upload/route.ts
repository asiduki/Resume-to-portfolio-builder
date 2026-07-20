import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { connectToDatabase } from "@/app/lib/db";
import User from "@/models/usermodel";
import cloudinary from "@/app/lib/cloudinary";

  export async function POST(req: NextRequest) {
    try{
        const session = await getServerSession(authOptions);
        console.log("Session:", session);
      if (!session?.user?.id) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
          return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
          return NextResponse.json({ error: "Must be an image under 2MB" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
              {
                  public_id: `avatars/${session.user.id}`, 
                  overwrite: true,
                  invalidate: true, 
                  transformation: [{ width: 512, height: 512, crop: "fill", gravity: "face" }],
              },
              (err, res) => (err || !res ? reject(err) : resolve(res)),
          ).end(buffer);
      });

      await connectToDatabase();
      await User.findByIdAndUpdate(session.user.id, { image: result.secure_url });

      return NextResponse.json({ image: result.secure_url });

    }
    catch (error) {
        console.error("Error uploading avatar:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }  
  }