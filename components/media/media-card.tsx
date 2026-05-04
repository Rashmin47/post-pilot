"use client";

import { IKImage } from "imagekitio-next";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Copy, Trash, Wand2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface MediaCardProps {
  asset: {
    id: string;
    url: string;
    imageKitFileId: string;
    type: string;
    size?: number | null;
    createdAt: Date;
  };
  onTransform?: (asset: any) => void;
}

export const MediaCard = ({ asset, onTransform }: MediaCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const copyUrl = () => {
    navigator.clipboard.writeText(asset.url);
    toast.success("URL copied to clipboard");
  };

  const deleteAsset = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/media/${asset.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete asset");
      }

      toast.success("Asset deleted");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete asset");
    } finally {
      setIsDeleting(false);
    }
  };

  const isImage = asset.type.startsWith("image");

  return (
    <Card className="overflow-hidden group relative">
      <div className="aspect-square relative overflow-hidden bg-muted">
        {isImage ? (
          <IKImage
            path={asset.url.split("/").pop()} // Assuming url is the full path or just the name
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
            transformation={[{ width: "300", height: "300", cropMode: "extract" }]}
            loading="lazy"
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
            alt="media asset"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground italic text-xs">
            Video Asset
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyUrl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </DropdownMenuItem>
              {isImage && (
                <DropdownMenuItem onClick={() => onTransform?.(asset)}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Transform
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => window.open(asset.url, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Original
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                disabled={isDeleting}
                onClick={deleteAsset}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardFooter className="p-2 flex flex-col items-start gap-0.5 border-t">
        <p className="text-xs font-medium truncate w-full">
          {asset.url.split("/").pop()}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {asset.size ? `${(asset.size / 1024 / 1024).toFixed(2)} MB` : "N/A"} •{" "}
          {format(new Date(asset.createdAt), "MMM d, yyyy")}
        </p>
      </CardFooter>
    </Card>
  );
};
