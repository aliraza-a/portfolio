// src/app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { del } from "@vercel/blob";

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT update project (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Get the existing project to compare images
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Find removed images and delete them from Vercel Blob
    const removedImages: string[] = [];

    // Check if thumbnail changed
    if (
      existingProject.thumbnail &&
      existingProject.thumbnail !== data.thumbnail
    ) {
      removedImages.push(existingProject.thumbnail);
    }

    // Check for removed gallery images
    const newImages = Array.isArray(data.images) ? data.images : [];
    existingProject.images.forEach((img: string) => {
      if (!newImages.includes(img)) {
        removedImages.push(img);
      }
    });

    // Delete removed images from Vercel Blob
    if (removedImages.length > 0) {
      await Promise.allSettled(
        removedImages.map((url) =>
          del(url).catch((err) =>
            console.error(`Failed to delete image: ${url}`, err)
          )
        )
      );
    }

    // Parse and validate order as integer
    const order = parseInt(String(data.order), 10);

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: String(data.title).trim(),
        slug: String(data.slug).trim(),
        description: String(data.description).trim(),
        longDescription: data.longDescription
          ? String(data.longDescription).trim()
          : null,
        thumbnail: String(data.thumbnail),
        images: newImages,
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

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the project first to delete its images
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Collect all images to delete
    const imagesToDelete: string[] = [];
    if (project.thumbnail) {
      imagesToDelete.push(project.thumbnail);
    }
    imagesToDelete.push(...project.images);

    // Delete images from Vercel Blob
    if (imagesToDelete.length > 0) {
      await Promise.allSettled(
        imagesToDelete.map((url) =>
          del(url).catch((err) =>
            console.error(`Failed to delete image: ${url}`, err)
          )
        )
      );
    }

    // Delete the project from database
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
