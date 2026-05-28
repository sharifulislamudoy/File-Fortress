"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderEdit } from "lucide-react";
import { folderApi } from "@/lib/api";

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  folderId: string;
  currentName: string;
  currentPurpose: string;
}

export default function EditFolderModal({
  isOpen,
  onClose,
  onSuccess,
  folderId,
  currentName,
  currentPurpose,
}: EditFolderModalProps) {
  const [name, setName] = useState(currentName);
  const [purpose, setPurpose] = useState(currentPurpose);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setPurpose(currentPurpose);
      setError("");
    }
  }, [isOpen, currentName, currentPurpose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Folder name is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await folderApi.update(folderId, { name: name.trim(), purpose: purpose.trim() });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update folder");
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
              <div className="flex items-center gap-2">
                <FolderEdit className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">Edit Folder</h3>
              </div>
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Folder Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Folder Purpose</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}