"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IKImage } from "imagekitio-next";
import { Check, Library, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MediaPickerModalProps {
  onSelect: (urls: string[]) => void;
  selectedUrls: string[];
  maxSelect?: number;
}

export const MediaPickerModal = ({
  onSelect,
  selectedUrls,
  maxSelect = 4,
}: MediaPickerModalProps) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentSelected, setCurrentSelected] = useState<string[]>(selectedUrls);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/media");
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error("Failed to fetch assets", error);
    } finally {
      setIsLoading(true);
      setIsLoading(false);
    }
  };

  const toggleSelect = (url: string) => {
    if (currentSelected.includes(url)) {
      setCurrentSelected(currentSelected.filter((u) => u !== url));
    } else {
      if (currentSelected.length < maxSelect) {
        setCurrentSelected([...currentSelected, url]);
      }
    }
  };

  const handleConfirm = () => {
    onSelect(currentSelected);
    setIsOpen(false);
  };

  const filteredAssets = assets.filter((asset) =>
    asset.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Library className="h-4 w-4" />
          Library
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media from Library</DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading assets...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>No assets found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = currentSelected.includes(asset.url);
                return (
                  <div
                    key={asset.id}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted"
                    )}
                    onClick={() => toggleSelect(asset.url)}
                  >
                    <IKImage
                      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                      src={asset.url}
                      transformation={[{ width: "200", height: "200", cropMode: "extract" }]}
                      className="object-cover w-full h-full"
                      alt="asset"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            {currentSelected.length} of {maxSelect} selected
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Selection</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
