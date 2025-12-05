// src/app/admin/dashboard/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Plus,
  Search,
  Filter,
  FileEdit,
  Trash2,
  Loader2,
  Star,
  ExternalLink,
  Github,
} from "lucide-react";
import Link from "next/link";
import { Project } from "@/types/project";
import Image from "next/image";

export default function ProjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchProjects();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      if (!res.ok) {
        router.push("/admin");
      }
    } catch {
      router.push("/admin");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects?admin=true");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      // The API will handle deleting images from Vercel Blob
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        setDeleteId(null);
      } else {
        const data = await res.json();
        console.error("Failed to delete project:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground mt-1">
                Manage your portfolio projects
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/dashboard/projects/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Link>
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-4 mb-6"
          >
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 rounded-xl bg-secondary/30 border border-border"
            >
              <FolderKanban className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "ALL"
                  ? "No projects match your filters"
                  : "No projects yet"}
              </p>
              {!searchQuery && statusFilter === "ALL" && (
                <Button asChild>
                  <Link href="/admin/dashboard/projects/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first project
                  </Link>
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-secondary relative overflow-hidden">
                      {project.thumbnail ? (
                        <Image
                          width={500}
                          height={500}
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FolderKanban className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                            project.status === "PUBLISHED"
                              ? "bg-green-500/80 text-white"
                              : project.status === "DRAFT"
                              ? "bg-yellow-500/80 text-white"
                              : "bg-gray-500/80 text-white"
                          }`}
                        >
                          {project.status}
                        </span>
                        {project.featured && (
                          <span className="p-1 rounded-full bg-purple-500/80 backdrop-blur-sm">
                            <Star className="w-3 h-3 text-white fill-white" />
                          </span>
                        )}
                      </div>

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="secondary" asChild>
                          <Link
                            href={`/admin/dashboard/projects/${project.id}`}
                          >
                            <FileEdit className="w-4 h-4" />
                          </Link>
                        </Button>
                        {project.liveUrl && (
                          <Button size="icon" variant="secondary" asChild>
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button size="icon" variant="secondary" asChild>
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => setDeleteId(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 truncate">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !deleting && setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-xl p-6 max-w-md w-full border border-border"
            >
              <h3 className="text-xl font-semibold mb-2">Delete Project?</h3>
              <p className="text-muted-foreground mb-6">
                This action cannot be undone. The project will be permanently
                deleted.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteId)}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
