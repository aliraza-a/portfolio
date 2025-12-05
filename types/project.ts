// src/types/project.ts
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  thumbnail: string;
  images: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  technologies: string[];
  category: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  category: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  order: number;
}
