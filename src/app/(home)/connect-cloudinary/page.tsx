"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cloud, Shield, AlertTriangle, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ConnectCloudinaryPage() {
  const [folderName, setFolderName] = useState("");
  const [unsignedUploadPreset, setUnsignedUploadPreset] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { saveCloudinaryConfig } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!folderName.trim() || !unsignedUploadPreset.trim()) {
      setError("Both fields are required");
      return;
    }
    setShowWarning(true);
  };

  const confirmConnection = async () => {
    setLoading(true);
    setError("");
    try {
      await saveCloudinaryConfig(folderName.trim(), unsignedUploadPreset.trim());
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save configuration");
    } finally {
      setLoading(false);
      setShowWarning(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-green">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(transparent, transparent 39px, rgba(74, 222, 128, 0.1) 39px, rgba(74, 222, 128, 0.1) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(74, 222, 128, 0.1) 39px, rgba(74, 222, 128, 0.1) 40px)
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-emerald-500/20 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white/80">Cloudinary Integration</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Connect Cloudinary</h2>
            <p className="text-white/60 mt-2 text-sm">
              Enable secure cloud storage for your files
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Cloudinary Folder Name
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 transition-colors"
                placeholder="my-app-folder"
                required
              />
              <p className="text-white/40 text-xs mt-1">
                The folder where your files will be stored in Cloudinary
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Unsigned Upload Preset
              </label>
              <input
                type="text"
                value={unsignedUploadPreset}
                onChange={(e) => setUnsignedUploadPreset(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 transition-colors"
                placeholder="my_unsigned_preset"
                required
              />
              <p className="text-white/40 text-xs mt-1">
                Create an unsigned upload preset in your Cloudinary settings
              </p>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
            >
              Connect Cloudinary
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="https://cloudinary.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Don't have a Cloudinary account? Create one <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-dark-green/95 backdrop-blur-md rounded-2xl border border-red-500/30 max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xl font-bold">Warning: Irreversible Action</h3>
            </div>
            <p className="text-white/80 mb-4">
              Once you connect Cloudinary, you will not be able to change your folder name or upload preset later. 
              Please double-check your inputs.
            </p>
            <div className="bg-white/5 rounded-lg p-3 mb-6">
              <p className="text-sm text-white/60">
                <span className="font-semibold">Folder:</span> {folderName}
              </p>
              <p className="text-sm text-white/60 mt-1">
                <span className="font-semibold">Upload Preset:</span> {unsignedUploadPreset}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmConnection}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Connecting..." : "Yes, Connect"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}