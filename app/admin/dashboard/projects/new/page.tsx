// src/app/admin/dashboard/projects/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ImageUpload } from "@/components/admin/image-upload";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { ProjectFormData } from "@/types/project";

const categories = [
  "Web Application",
  "E-commerce",
  "Landing Page",
  "Portfolio",
  "Dashboard",
  "Mobile App",
  "Other",
];

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [techInput, setTechInput] = useState("");

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    thumbnail: "",
    images: [],
    liveUrl: "",
    githubUrl: "",
    technologies: [],
    category: "Web Application",
    featured: false,
    status: "DRAFT",
    order: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "order") {
      // Parse order as number
      const numValue = parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Ensure order is a number before sending
      const dataToSend = {
        ...formData,
        order: Number(formData.order) || 0,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create project");
      }

      router.push("/admin/dashboard/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-secondary/30 border-r border-border p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">AR</span>
          </div>
          <div>
            <h2 className="font-semibold">Ali Raza</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/dashboard/projects"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary"
          >
            <FolderKanban className="w-5 h-5" />
            Projects
          </Link>
        </nav>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/admin/dashboard/projects"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Projects
            </Link>
            <h1 className="text-3xl font-bold">New Project</h1>
            <p className="text-muted-foreground mt-1">
              Add a new project to your portfolio
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-6">
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={() => !formData.slug && generateSlug()}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                    placeholder="My Awesome Project"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Slug <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="my-awesome-project"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateSlug}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Short Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="A brief description of your project..."
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Long Description
                </label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="A detailed description with features, challenges, and solutions..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Media - Using Upload Components */}
            <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-6">
              <h2 className="text-lg font-semibold">Media</h2>

              {/* Thumbnail Upload */}
              <ImageUpload
                label="Thumbnail"
                required
                value={formData.thumbnail}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, thumbnail: url }))
                }
                onRemove={() =>
                  setFormData((prev) => ({ ...prev, thumbnail: "" }))
                }
              />

              {/* Gallery Upload */}
              <MultiImageUpload
                label="Gallery Images"
                maxImages={8}
                values={formData.images}
                onChange={(urls) =>
                  setFormData((prev) => ({ ...prev, images: urls }))
                }
              />
            </div>

            {/* Links */}
            <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-6">
              <h2 className="text-lg font-semibold">Links</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Live URL
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                    placeholder="https://myproject.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-6">
              <h2 className="text-lg font-semibold">Technologies</h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="React, Next.js, Tailwind..."
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTechnology())
                  }
                />
                <Button type="button" variant="outline" onClick={addTechnology}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Status & Settings */}
            <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-6">
              <h2 className="text-lg font-semibold">Status & Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-8">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured Project
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/dashboard/projects">Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}
