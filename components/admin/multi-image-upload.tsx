// src/components/admin/multi-image-upload.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { X, Loader2, GripVertical, AlertCircle, Plus } from "lucide-react";
import Image from "next/image";

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  values,
  onChange,
  label = "Gallery Images",
  maxImages = 10,
  className = "",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    setError("");
    setUploading(true);

    const remainingSlots = maxImages - values.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      setError(`Maximum ${maxImages} images allowed`);
      setUploading(false);
      return;
    }

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        return data.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      onChange([...values, ...newUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length > 0) {
        const dt = new DataTransfer();
        imageFiles.forEach((f) => dt.items.add(f));
        handleUpload(dt.files);
      } else {
        setError("Please drop image files only");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = async (urlToRemove: string) => {
    try {
      // Delete from Vercel Blob
      await fetch(`/api/upload?url=${encodeURIComponent(urlToRemove)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
    onChange(values.filter((url) => url !== urlToRemove));
  };

  const handleReorder = (newOrder: string[]) => {
    onChange(newOrder);
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium mb-2 block">
          {label}
          <span className="text-muted-foreground ml-2">
            ({values.length}/{maxImages})
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      {values.length < maxImages && (
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`
            relative h-32 rounded-lg border-2 border-dashed mb-4
            flex flex-col items-center justify-center gap-2 cursor-pointer
            transition-colors
            ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-secondary/50"
            }
            ${uploading ? "pointer-events-none" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <div className="p-2 rounded-full bg-secondary">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Drop images or click to upload
              </p>
            </>
          )}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 text-sm text-destructive"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      {/* Image Grid with Reordering */}
      {values.length > 0 && (
        <Reorder.Group
          axis="x"
          values={values}
          onReorder={handleReorder}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        >
          <AnimatePresence>
            {values.map((url) => (
              <Reorder.Item
                key={url}
                value={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-video rounded-lg overflow-hidden bg-secondary border border-border group cursor-grab active:cursor-grabbing"
              >
                <Image
                  width={500}
                  height={500}
                  src={url}
                  alt="Gallery"
                  className="w-full h-full object-cover pointer-events-none"
                />

                {/* Drag Handle */}
                <div className="absolute top-2 left-2 p-1 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-3 h-3 text-white" />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(url);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                >
                  <X className="w-3 h-3" />
                </button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {values.length > 1 && (
        <p className="text-xs text-muted-foreground mt-2">
          Drag images to reorder
        </p>
      )}
    </div>
  );
}
