import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Prompt from "@/models/Prompt";
import User from "@/models/User";
import { auth } from "@/lib/firebase-admin";

// Helper function to verify Firebase token and get MongoDB user
async function getUserFromToken(request) {
  try {
    // Get token from cookie
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const tokenMatch = cookieHeader.match(/firebase-token=([^;]+)/);
    if (!tokenMatch) return null;

    const token = tokenMatch[1];

    // Verify token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);

    // Get user from MongoDB
    await connectToDatabase();
    const user = await User.findOne({ uid: decodedToken.uid });

    return user;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

// Delete a prompt
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const promptId = params.id;

    await connectToDatabase();

    // Find the prompt and check if it belongs to the user
    const prompt = await Prompt.findById(promptId);

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    if (prompt.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the prompt
    await Prompt.findByIdAndDelete(promptId);

    // Remove the prompt from the user's prompts array
    await User.findByIdAndUpdate(user._id, {
      $pull: { prompts: promptId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
