// src/components/sections/footer.tsx
"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Ali Raza. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Built with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1" /> using
            Next.js & Framer Motion
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
