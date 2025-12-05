// src/app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET all messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const starred = searchParams.get("starred");

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (starred === "true") {
      where.starred = true;
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Get counts for stats
    const counts = await prisma.message.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const totalCount = await prisma.message.count();
    const starredCount = await prisma.message.count({
      where: { starred: true },
    });

    const stats = {
      total: totalCount,
      unread: counts.find((c) => c.status === "UNREAD")?._count.status || 0,
      read: counts.find((c) => c.status === "READ")?._count.status || 0,
      replied: counts.find((c) => c.status === "REPLIED")?._count.status || 0,
      archived: counts.find((c) => c.status === "ARCHIVED")?._count.status || 0,
      starred: starredCount,
    };

    return NextResponse.json({ messages, stats });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
