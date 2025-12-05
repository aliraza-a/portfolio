// src/components/sections/contact.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "razaa8075@gmail.com",
    href: "mailto:razaa8075@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0307-3641084",
    href: "tel:+923073641084",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/a1irazaaa",
    href: "https://linkedin.com/in/a1irazaaa",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Karachi, Pakistan",
    href: "#",
  },
];

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message: string;
}

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus({ type: "idle", message: "" });
      }, 5000);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to send message",
      });
    }
  };

  return (
    <section id="contact" className="py-32 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Contact
          </span>
          <h2 className="text-4xl font-bold mt-4 mb-4">
            Let&apos;s work together
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  info.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <info.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {info.label}
                  </div>
                  <div className="font-medium">{info.value}</div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl bg-background border border-border/50"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status.type === "loading"}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status.type === "loading"}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Subject <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={status.type === "loading"}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                  placeholder="How can I help you?"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={status.type === "loading"}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors resize-none disabled:opacity-50"
                  placeholder="Your message..."
                />
              </div>

              {/* Status Message */}
              <AnimatePresence mode="wait">
                {status.type !== "idle" && status.type !== "loading" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-2 p-4 rounded-lg ${
                      status.type === "success"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle className="w-5 h-5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    )}
                    <span className="text-sm">{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full group"
                size="lg"
                disabled={status.type === "loading"}
              >
                {status.type === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
