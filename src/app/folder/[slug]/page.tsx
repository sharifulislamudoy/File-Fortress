"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FolderOpen,
  File,
  Image,
  Video,
  FileText,
  Upload,
  ArrowLeft,
  Trash2,
  Download,
  ExternalLink,
  FileArchive,
  FileCode,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import FileUploadModal from "@/components/FileUploadModal";
import Chatbot from "@/components/Chatbot";

interface Folder {
  _id: string;
  name: string;
  purpose: string;
  slug: string;
}

interface FileItem {
  _id: string;
  originalName: string;
  url: string;
  fileType: "image" | "video" | "document" | "other";
  size: number;
  mimeType: string;
}

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

const getFileIcon = (file: FileItem) => {
  const ext = getFileExtension(file.originalName);
  if (file.fileType === "image") return <Image className="w-8 h-8 text-emerald-400" />;
  if (file.fileType === "video") return <Video className="w-8 h-8 text-emerald-400" />;
  if (ext === "pdf") return <FileText className="w-8 h-8 text-red-400" />;
  if (["doc", "docx"].includes(ext)) return <FileText className="w-8 h-8 text-blue-400" />;
  if (["xls", "xlsx", "csv"].includes(ext)) return <FileText className="w-8 h-8 text-green-400" />;
  if (["ppt", "pptx"].includes(ext)) return <FileText className="w-8 h-8 text-orange-400" />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return <FileArchive className="w-8 h-8 text-yellow-400" />;
  if (["txt", "md"].includes(ext)) return <FileCode className="w-8 h-8 text-gray-400" />;
  return <File className="w-8 h-8 text-white/60" />;
};

const getThumbnailUrl = (url: string, fileType: string, mimeType: string): string | null => {
  if (fileType === "image") return `${url}?w=150&h=150&fit=crop&auto=format`;
  if (fileType === "video" && mimeType.startsWith("video/")) return `${url}?w=150&h=150&fit=crop&auto=format&resource_type=video&format=jpg`;
  return null;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download file. Please try again.');
  }
};

export default function FolderPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [folder, setFolder] = useState<Folder | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFileModal, setShowFileModal] = useState(false);
  const [error, setError] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && slug) fetchFolderContents();
  }, [user, slug]);

  const fetchFolderContents = async () => {
    setLoading(true);
    setError("");
    try {
      const folderRes = await api.get(`/folders/slug/${slug}`);
      const currentFolder = folderRes.data;
      setFolder(currentFolder);
      const contentsRes = await api.get(`/folders/${currentFolder._id}/contents`);
      setFiles(contentsRes.data.files);
    } catch (err: any) {
      setError(err.response?.data?.message || "Folder not found");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await api.delete(`/files/${fileId}`);
      fetchFolderContents();
    } catch (err) {
      alert("Failed to delete file");
    }
  };

  const handleDownload = async (file: FileItem) => {
    setDownloadingId(file._id);
    await downloadFile(file.url, file.originalName);
    setDownloadingId(null);
  };

  const openPreview = (file: FileItem) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-dark-green flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !folder) {
    return (
      <div className="min-h-screen bg-dark-green flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">{error || "Folder not found"}</p>
          <Link href="/" className="text-emerald-400 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-green pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Back button and Upload */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-white/60 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{folder.name}</h1>
              <p className="text-white/60 mt-1">{folder.purpose}</p>
            </div>
            <button
              onClick={() => setShowFileModal(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              Add File
            </button>
          </div>
        </div>

        {/* Files Section */}
        {files.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-white/80 mb-3">Files</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => {
                const thumbnailUrl = getThumbnailUrl(file.url, file.fileType, file.mimeType);
                const isDownloading = downloadingId === file._id;
                return (
                  <div key={file._id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden group hover:border-emerald-400/50 transition-all">
                    <div className="relative aspect-video bg-black/30 flex items-center justify-center">
                      {thumbnailUrl ? (
                        <img src={thumbnailUrl} alt={file.originalName} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = "none"} />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          {getFileIcon(file)}
                          <span className="text-xs text-white/40 uppercase">{getFileExtension(file.originalName) || "file"}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button onClick={() => openPreview(file)} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full transition-all" title="Quick Preview"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDownload(file)} disabled={isDownloading} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all disabled:opacity-50" title="Download">
                          {isDownloading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                        </button>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all" title="Open in New Tab"><ExternalLink className="w-4 h-4" /></a>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate" title={file.originalName}>{file.originalName}</p>
                          <p className="text-white/40 text-xs mt-1">{formatFileSize(file.size)}</p>
                        </div>
                        <button onClick={() => handleDeleteFile(file._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">This folder is empty.</p>
            <p className="text-white/40 text-sm mt-2">Upload a file to get started.</p>
          </div>
        )}
      </div>

      {/* File Preview Modal (same as before) */}
      {isPreviewOpen && previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={closePreview}>
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-dark-green rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                {getFileIcon(previewFile)}
                <span className="text-white font-medium truncate">{previewFile.originalName}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDownload(previewFile)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors flex items-center gap-2"><Download className="w-4 h-4" /><span className="text-sm hidden sm:inline">Download</span></button>
                <a href={previewFile.url} target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"><ExternalLink className="w-4 h-4" /></a>
                <button onClick={closePreview} className="bg-red-500/20 hover:bg-red-500 text-white p-2 rounded-lg transition-colors"><ArrowLeft className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center min-h-[50vh]">
              {previewFile.fileType === "image" && <img src={previewFile.url} alt={previewFile.originalName} className="max-w-full max-h-[70vh] object-contain rounded-lg" />}
              {previewFile.fileType === "video" && <video src={previewFile.url} controls className="max-w-full max-h-[70vh] rounded-lg" autoPlay={false} />}
              {(previewFile.fileType === "document" || previewFile.fileType === "other") && (
                <div className="text-center p-8">
                  {getFileIcon(previewFile)}
                  <p className="text-white/60 mt-4">Preview not available for this file type.</p>
                  <button onClick={() => handleDownload(previewFile)} className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">Download File</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <FileUploadModal isOpen={showFileModal} onClose={() => setShowFileModal(false)} onSuccess={fetchFolderContents} folderId={folder._id} />
      <Chatbot />
    </div>
  );
}