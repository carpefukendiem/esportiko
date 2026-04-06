import type { UploadedAssetMeta } from "@/lib/types";

export function fileToAssetMeta(file: File): UploadedAssetMeta {
  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || "application/octet-stream",
    uploadedAt: new Date().toISOString(),
  };
}

export function filesToAssetMetaList(files: File[] | FileList | null | undefined): UploadedAssetMeta[] {
  if (!files || files.length === 0) return [];
  return Array.from(files).map(fileToAssetMeta);
}
