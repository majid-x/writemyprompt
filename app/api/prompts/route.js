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

// Get user's prompts
export async function GET(request) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompts = await Prompt.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Save a new prompt
export async function POST(request) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userInput, model, generatedPrompt } = await request.json();

    if (!userInput || !model || !generatedPrompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = await Prompt.create({
      userId: user._id,
      userInput,
      model,
      generatedPrompt,
    });

    // Update user's prompts array
    await User.findByIdAndUpdate(user._id, {
      $push: { prompts: prompt._id },
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error("Error saving prompt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
