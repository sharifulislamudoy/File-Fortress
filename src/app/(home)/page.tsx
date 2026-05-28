"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import FolderModal from "@/components/FolderModal";
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
  const [showModal, setShowModal] = useState(false);
  const [hasRootFolders, setHasRootFolders] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchRootFolders();
    }
  }, [authLoading, user]);

  const fetchRootFolders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/folders/root");
      setFolders(response.data);
      setHasRootFolders(response.data.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark-green flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user has no root folders, show hero section with "Get Started" button
  if (!user || (!hasRootFolders && !loading)) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-dark-green">
        {/* Animated Background (same as existing) */}
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
                onClick={() => setShowModal(true)}
                className="group bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        <FolderModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchRootFolders}
        />
        <Chatbot />
      </div>
    );
  }

  // User has folders - show their root folders
  return (
    <div className="min-h-screen bg-dark-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">My Folders</h1>
          <button
            onClick={() => setShowModal(true)}
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
              <Link
                key={folder._id}
                href={`/folder/${folder.slug}`}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-4 hover:border-emerald-400 transition-all group"
              >
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
            ))}
          </div>
        )}
      </div>
      <FolderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchRootFolders}
      />
      <Chatbot />
    </div>
  );
}