// src/app/admin/dashboard/messages/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  LogOut,
  Search,
  Trash2,
  Loader2,
  Star,
  Mail,
  MailOpen,
  Reply,
  Archive,
  ExternalLink,
  ChevronRight,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { Message } from "@/types/message";
import { formatDistanceToNow } from "date-fns";

interface Stats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
  starred: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0,
    starred: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [starredFilter, setStarredFilter] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchMessages();
  }, [statusFilter, starredFilter]);

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

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (starredFilter) params.set("starred", "true");

      const res = await fetch(`/api/messages?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage({
            ...selectedMessage,
            status: status as Message["status"],
          });
        }
      }
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  };

  const handleStarToggle = async (id: string, starred: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred }),
      });
      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, starred } : m)));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, starred });
        }
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to toggle star:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        setDeleteId(null);
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (message.status === "UNREAD") {
      handleStatusChange(message.id, "READ");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UNREAD":
        return <Mail className="w-4 h-4" />;
      case "READ":
        return <MailOpen className="w-4 h-4" />;
      case "REPLIED":
        return <Reply className="w-4 h-4" />;
      case "ARCHIVED":
        return <Archive className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNREAD":
        return "bg-blue-500";
      case "READ":
        return "bg-gray-400";
      case "REPLIED":
        return "bg-green-500";
      case "ARCHIVED":
        return "bg-gray-600";
      default:
        return "bg-gray-400";
    }
  };

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
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <FolderKanban className="w-5 h-5" />
            Projects
          </Link>
          <Link
            href="/admin/dashboard/messages"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary"
          >
            <MessageSquare className="w-5 h-5" />
            Messages
            {stats.unread > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {stats.unread}
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
      <main className="ml-64 h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-muted-foreground mt-1">
                Manage contact form submissions
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Stats Pills */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm">
                  {stats.unread} unread
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm">
                  {stats.total} total
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Message List */}
          <div className="w-96 border-r border-border flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="ALL">All</option>
                  <option value="UNREAD">Unread</option>
                  <option value="READ">Read</option>
                  <option value="REPLIED">Replied</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <Button
                  variant={starredFilter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStarredFilter(!starredFilter)}
                >
                  <Star
                    className={`w-4 h-4 ${starredFilter ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No messages found</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => handleSelectMessage(message)}
                      className={`p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${
                        selectedMessage?.id === message.id
                          ? "bg-secondary/50"
                          : ""
                      } ${message.status === "UNREAD" ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarToggle(message.id, !message.starred);
                          }}
                          className="mt-1 text-muted-foreground hover:text-yellow-500 transition-colors"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              message.starred
                                ? "fill-yellow-500 text-yellow-500"
                                : ""
                            }`}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${getStatusColor(
                                message.status
                              )}`}
                            />
                            <span
                              className={`font-medium truncate ${
                                message.status === "UNREAD"
                                  ? "font-semibold"
                                  : ""
                              }`}
                            >
                              {message.name}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {message.subject}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="flex-1 flex flex-col">
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {selectedMessage.name}
                        </span>
                        <span>&lt;{selectedMessage.email}&gt;</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStarToggle(
                            selectedMessage.id,
                            !selectedMessage.starred
                          )
                        }
                      >
                        <Star
                          className={`w-4 h-4 ${
                            selectedMessage.starred
                              ? "fill-yellow-500 text-yellow-500"
                              : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(selectedMessage.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">
                      Mark as:
                    </span>
                    {["UNREAD", "READ", "REPLIED", "ARCHIVED"].map((status) => (
                      <Button
                        key={status}
                        variant={
                          selectedMessage.status === status
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleStatusChange(selectedMessage.id, status)
                        }
                      >
                        {getStatusIcon(status)}
                        <span className="ml-1 capitalize">
                          {status.toLowerCase()}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Reply Action */}
                <div className="p-6 border-t border-border">
                  <Button asChild className="w-full">
                    <a
                      href={`mailto:${
                        selectedMessage.email
                      }?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject
                      )}`}
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Reply to {selectedMessage.name}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No message selected</h3>
                <p className="text-muted-foreground mt-1">
                  Select a message from the list to view its contents
                </p>
              </div>
            )}
          </div>
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
              <h3 className="text-xl font-semibold mb-2">Delete Message?</h3>
              <p className="text-muted-foreground mb-6">
                This action cannot be undone. The message will be permanently
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
