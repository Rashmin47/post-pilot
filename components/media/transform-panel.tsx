"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IKImage } from "imagekitio-next";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

interface TransformPanelProps {
  asset: any;
  isOpen: boolean;
  onClose: () => void;
}

export const TransformPanel = ({
  asset,
  isOpen,
  onClose,
}: TransformPanelProps) => {
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("800");
  const [cropMode, setCropMode] = useState("maintain_ratio");
  const [quality, setQuality] = useState("90");
  const [format, setFormat] = useState("auto");
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const transformations: any[] = [];
  if (width) transformations.push({ width });
  if (height) transformations.push({ height });
  if (cropMode !== "maintain_ratio") transformations.push({ cropMode });
  if (quality) transformations.push({ quality });
  if (format !== "auto") transformations.push({ format });

  // Generate the transformed URL for copying
  const baseUrl = asset.url;
  const transformString = transformations
    .map((t) => Object.entries(t).map(([k, v]) => `${k}-${v}`).join(","))
    .join(":");
  
  const transformedUrl = transformString 
    ? `${baseUrl}?tr=${transformString}`
    : baseUrl;

  const copyUrl = () => {
    navigator.clipboard.writeText(transformedUrl);
    setCopied(true);
    toast.success("Transformed URL copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>AI Image Transformations</SheetTitle>
          <SheetDescription>
            Apply real-time transformations using ImageKit CDN.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="aspect-video relative bg-muted rounded-lg overflow-hidden border">
            <IKImage
              urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
              src={asset.url}
              transformation={transformations}
              className="object-contain w-full h-full"
              alt="Transformation preview"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Width (px)</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Crop Mode</Label>
            <Select value={cropMode} onValueChange={setCropMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintain_ratio">Maintain Ratio</SelectItem>
                <SelectItem value="force">Force Resize</SelectItem>
                <SelectItem value="at_least">At Least</SelectItem>
                <SelectItem value="at_max">At Max</SelectItem>
                <SelectItem value="extract">Extract</SelectItem>
                <SelectItem value="pad_extract">Pad Extract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quality (1-100)</Label>
              <Input
                type="number"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (WebP/AVIF)</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Transformed URL</Label>
            <div className="flex gap-2">
              <Input value={transformedUrl} readOnly className="text-xs" />
              <Button size="icon" variant="outline" onClick={copyUrl}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button className="w-full" onClick={() => window.open(transformedUrl, "_blank")}>
            <Download className="h-4 w-4 mr-2" />
            Download Transformed
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
