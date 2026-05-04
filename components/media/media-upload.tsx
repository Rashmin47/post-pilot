"use client";

import { IKUpload } from "imagekitio-next";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MediaUploadProps {
  onSuccess?: (url: string) => void;
  folder?: string;
}

export const MediaUpload = ({ onSuccess, folder = "/" }: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSuccess = async (res: any) => {
    try {
      // Save to our database
      const response = await fetch("/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageKitFileId: res.fileId,
          url: res.url,
          type: res.fileType,
          size: res.size,
          folder: folder,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save asset metadata");
      }

      toast.success("File uploaded successfully");
      router.refresh();
      if (onSuccess) onSuccess(res.url);
    } catch (error) {
      console.error("Upload save error:", error);
      toast.error("Failed to save upload info");
    } finally {
      setIsUploading(false);
    }
  };

  const handleError = (err: any) => {
    console.error("Upload error:", err);
    toast.error("Upload failed");
    setIsUploading(false);
  };

  const handleStart = () => {
    setIsUploading(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <IKUpload
        fileName="social-post"
        tags={["social-pilot"]}
        useUniqueFileName={true}
        folder={folder}
        style={{ display: "none" }}
        ref={ikUploadRef}
        onError={handleError}
        onSuccess={handleSuccess}
        onUploadStart={handleStart}
      />
      <Button
        onClick={() => ikUploadRef.current?.click()}
        disabled={isUploading}
        className="w-full h-32 border-2 border-dashed border-muted-foreground/25 bg-transparent hover:bg-muted/50 transition-all flex flex-col gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs text-muted-foreground">
                Images or videos (max 100MB)
              </span>
            </div>
          </>
        )}
      </Button>
    </div>
  );
};
