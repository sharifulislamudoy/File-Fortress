"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link, FileText, Plus } from "lucide-react";
import { noteApi } from "@/lib/api";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  folderId: string;
}

export default function NoteModal({ isOpen, onClose, onSuccess, folderId }: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"link" | "text">("link");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError(type === "link" ? "Link URL is required" : "Text content is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await noteApi.create({ folderId, title: title.trim(), type, content: content.trim() });
      setTitle("");
      setContent("");
      setType("link");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-green/95 backdrop-blur-md rounded-2xl border border-emerald-500/30 max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Add Note</h3>
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  placeholder="e.g., Important Link, Meeting Notes"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Note Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setType("link")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                      type === "link"
                        ? "bg-emerald-500 text-white"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                  >
                    <Link className="w-4 h-4" />
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("text")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                      type === "text"
                        ? "bg-emerald-500 text-white"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Plain Text
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  {type === "link" ? "URL" : "Text Content"}
                </label>
                {type === "link" ? (
                  <input
                    type="url"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                    placeholder="https://example.com"
                    required
                  />
                ) : (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 resize-none"
                    placeholder="Write your note here..."
                    required
                  />
                )}
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Saving..." : <><Plus className="w-4 h-4" /> Save Note</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}