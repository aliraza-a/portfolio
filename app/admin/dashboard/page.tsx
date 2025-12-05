// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  LogOut,
  Plus,
  Eye,
  FileEdit,
  Loader2,
  TrendingUp,
  Mail,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { Project } from "@/types/project";
import Image from "next/image";

interface MessageStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
  starred: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStats, setProjectStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
  });
  const [messageStats, setMessageStats] = useState<MessageStats>({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0,
    starred: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchData();
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

  const fetchData = async () => {
    try {
      // Fetch projects
      const projectsRes = await fetch("/api/projects?admin=true");
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
        setProjectStats({
          total: projectsData.length,
          published: projectsData.filter(
            (p: Project) => p.status === "PUBLISHED"
          ).length,
          draft: projectsData.filter((p: Project) => p.status === "DRAFT")
            .length,
          featured: projectsData.filter((p: Project) => p.featured).length,
        });
      }

      // Fetch messages
      const messagesRes = await fetch("/api/messages");
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessageStats(messagesData.stats);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  const statCards = [
    {
      label: "Total Projects",
      value: projectStats.total,
      icon: FolderKanban,
      color: "text-blue-500",
      href: "/admin/dashboard/projects",
    },
    {
      label: "Published",
      value: projectStats.published,
      icon: TrendingUp,
      color: "text-green-500",
      href: "/admin/dashboard/projects?status=PUBLISHED",
    },
    {
      label: "Unread Messages",
      value: messageStats.unread,
      icon: Mail,
      color: "text-orange-500",
      href: "/admin/dashboard/messages?status=UNREAD",
    },
    {
      label: "Total Messages",
      value: messageStats.total,
      icon: Inbox,
      color: "text-purple-500",
      href: "/admin/dashboard/messages",
    },
  ];

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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/dashboard/projects"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <FolderKanban className="w-5 h-5" />
            Projects
          </Link>
          <Link
            href="/admin/dashboard/messages"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="w-5 h-5" />
            Messages
            {messageStats.unread > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {messageStats.unread}
              </span>
            )}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here&apos;s an overview of your portfolio.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={stat.href}
                  className="block p-6 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/admin/dashboard/projects/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Project
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/dashboard/messages">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Messages
                  {messageStats.unread > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                      {messageStats.unread}
                    </span>
                  )}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/" target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  View Website
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Link
                href="/admin/dashboard/projects"
                className="text-sm text-primary hover:underline"
              >
                View all →
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12 rounded-xl bg-secondary/30 border border-border">
                <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <Button asChild>
                  <Link href="/admin/dashboard/projects/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first project
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                        {project.thumbnail ? (
                          <Image
                            width={48}
                            height={48}
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FolderKanban className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              project.status === "PUBLISHED"
                                ? "bg-green-500/20 text-green-500"
                                : project.status === "DRAFT"
                                ? "bg-yellow-500/20 text-yellow-500"
                                : "bg-gray-500/20 text-gray-500"
                            }`}
                          >
                            {project.status}
                          </span>
                          {project.featured && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-500">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/dashboard/projects/${project.id}`}>
                        <FileEdit className="w-4 h-4" />
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
