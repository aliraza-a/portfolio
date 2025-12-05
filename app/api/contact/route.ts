// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification, sendAutoReply } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Rate limiting check (simple implementation - check for recent submissions from same email)
    const recentMessage = await prisma.message.findFirst({
      where: {
        email: data.email,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
    });

    if (recentMessage) {
      return NextResponse.json(
        { error: "Please wait a few minutes before sending another message" },
        { status: 429 }
      );
    }

    // Save message to database
    const message = await prisma.message.create({
      data: {
        name: String(data.name).trim(),
        email: String(data.email).trim().toLowerCase(),
        subject: String(data.subject).trim(),
        message: String(data.message).trim(),
        status: "UNREAD",
        starred: false,
      },
    });

    // Send email notification to admin (don't await to speed up response)
    sendContactNotification({
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
    }).catch((err) => console.error("Failed to send notification email:", err));

    // Send auto-reply to user
    sendAutoReply({
      name: message.name,
      email: message.email,
      subject: message.subject,
    }).catch((err) => console.error("Failed to send auto-reply:", err));

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
