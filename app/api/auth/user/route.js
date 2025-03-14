import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

// Get user by Firebase UID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json({
      id: user._id,
      uid: user.uid,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create or update user
export async function POST(request) {
  try {
    const { uid, name, email, image } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: "UID and email are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    let user = await User.findOne({ uid });

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.email = email;
      if (image) user.image = image;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        uid,
        name: name || email.split("@")[0],
        email,
        image: image || "",
      });
    }

    return NextResponse.json(
      {
        id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
