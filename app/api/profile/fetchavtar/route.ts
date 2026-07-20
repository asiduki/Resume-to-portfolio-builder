import {NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/lib/auth";
import {connectToDatabase} from "@/app/lib/db";
import User from "@/models/usermodel";

export async function GET(req: Request) {

    try{
        const session = await getServerSession(authOptions);
        if(!session?.user?.id){
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        await connectToDatabase();
        const user = await User.findById(session.user.id).select("-password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({
            name: user.name,
            email: user.email,
            image: user.image,
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}