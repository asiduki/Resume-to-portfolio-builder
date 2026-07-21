import {connectToDatabase} from "@/app/lib/db";
import User from "@/models/usermodel";
import { isUsernameTaken, USERNAME_REGEX } from "@/app/lib/username";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string | null;
        const username = (formData.get("username") as string | null)?.trim().toLowerCase() || null;
        const email = formData.get("email") as string | null;
        const password = formData.get("password") as string | null;
        const file = formData.get("file") as File | null;

        if (!name || !username || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!USERNAME_REGEX.test(username)) {
            return NextResponse.json(
                { error: "Username must be 3-30 characters; letters, numbers, hyphens and underscores only" },
                { status: 400 }
            );
        }

        if (file && (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024)) {
            return NextResponse.json({ error: "Avatar must be an image under 2MB" }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        if (await isUsernameTaken(username)) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            image: file ? "" : "/avatar.png",
        });

        if (file) {
            try {
                const buffer = Buffer.from(await file.arrayBuffer());
                const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            public_id: `avatars/${user._id}`,
                            overwrite: true,
                            invalidate: true,
                            transformation: [{ width: 512, height: 512, crop: "fill", gravity: "face" }],
                        },
                        (err, res) => (err || !res ? reject(err) : resolve(res)),
                    ).end(buffer);
                });
                user.image = result.secure_url;
                await user.save();
            } catch (uploadError) {
                console.error("Avatar upload failed during registration:", uploadError);
            }
        }

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && (error as { code?: number }).code === 11000) {
            return NextResponse.json({ error: "Username or email already taken" }, { status: 400 });
        }

        console.error("Error registering user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
