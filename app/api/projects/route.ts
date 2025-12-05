// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET all projects (public for published, all for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminView = searchParams.get("admin") === "true";

    if (adminView) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const projects = await prisma.project.findMany({
      where: adminView ? {} : { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description || !data.thumbnail) {
      return NextResponse.json(
        { error: "Title, description, and thumbnail are required" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    let slug = data.slug;
    if (!slug) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      // Append a random string to make it unique
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Parse and validate order as integer
    const order = parseInt(String(data.order), 10);

    const project = await prisma.project.create({
      data: {
        title: String(data.title).trim(),
        slug: String(slug).trim(),
        description: String(data.description).trim(),
        longDescription: data.longDescription
          ? String(data.longDescription).trim()
          : null,
        thumbnail: String(data.thumbnail),
        images: Array.isArray(data.images) ? data.images : [],
        liveUrl: data.liveUrl ? String(data.liveUrl).trim() : null,
        githubUrl: data.githubUrl ? String(data.githubUrl).trim() : null,
        technologies: Array.isArray(data.technologies)
          ? data.technologies.map((t: unknown) => String(t).trim())
          : [],
        category: data.category ? String(data.category) : "Other",
        featured: Boolean(data.featured),
        status: ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(data.status)
          ? data.status
          : "DRAFT",
        order: isNaN(order) ? 0 : order,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
