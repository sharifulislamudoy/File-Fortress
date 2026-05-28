"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FolderOpen, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { folderApi } from "@/lib/api";
import FolderModal from "@/components/FolderModal";
import EditFolderModal from "@/components/EditFolderModal";
import Chatbot from "@/components/Chatbot";

interface Folder {
  _id: string;
  name: string;
  purpose: string;
  slug: string;
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchRootFolders();
    }
  }, [authLoading, user]);

  const fetchRootFolders = async () => {
    setLoading(true);
    try {
      const response = await folderApi.getRoot();
      setFolders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    if (!confirm(`Delete "${folderName}" and all its files & notes? This cannot be undone.`)) return;
    setDeletingId(folderId);
    try {
      await folderApi.delete(folderId);
      await fetchRootFolders();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete folder");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark-green flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user has no folders, show hero section with "Get Started"
  if (!user || (folders.length === 0 && !loading)) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-dark-green">
        {/* Animated Background (same as before) */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(transparent, transparent 39px, rgba(74, 222, 128, 0.15) 39px, rgba(74, 222, 128, 0.15) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(74, 222, 128, 0.15) 39px, rgba(74, 222, 128, 0.15) 40px)
            `,
            backgroundSize: "40px 40px",
          }}
          animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <span className="text-sm font-medium text-white/80">Encrypted Storage</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Your Files, Your
              <span className="text-emerald-400 block sm:inline"> Private Cloud</span>
            </h1>

            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Organize files and folders just like your PC. Military-grade encryption,
              voice-controlled navigation, and secure cloud backup.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="group bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        <FolderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchRootFolders}
        />
        <Chatbot />
      </div>
    );
  }

  // User has folders - show them with edit/delete
  return (
    <div className="min-h-screen bg-dark-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">My Folders</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            New Folder
          </button>
        </div>

        {folders.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No folders yet. Click "New Folder" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <div
                key={folder._id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-emerald-500/20 hover:border-emerald-400 transition-all group relative"
              >
                <Link href={`/folder/${folder.slug}`} className="block p-4">
                  <div className="flex items-start gap-3">
                    <FolderOpen className="w-10 h-10 text-emerald-400" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {folder.name}
                      </h3>
                      <p className="text-white/60 text-sm mt-1 line-clamp-2">{folder.purpose}</p>
                    </div>
                  </div>
                </Link>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingFolder(folder)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-blue-500/80 text-white/70 hover:text-white transition-colors"
                    title="Edit folder"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(folder._id, folder.name)}
                    disabled={deletingId === folder._id}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/80 text-white/70 hover:text-white transition-colors disabled:opacity-50"
                    title="Delete folder"
                  >
                    {deletingId === folder._id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchRootFolders}
      />
      {editingFolder && (
        <EditFolderModal
          isOpen={!!editingFolder}
          onClose={() => setEditingFolder(null)}
          onSuccess={fetchRootFolders}
          folderId={editingFolder._id}
          currentName={editingFolder.name}
          currentPurpose={editingFolder.purpose}
        />
      )}
      <Chatbot />
    </div>
  );
}