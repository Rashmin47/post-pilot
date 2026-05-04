"use client";

import { useState } from "react";
import { MediaCard } from "./media-card";
import { TransformPanel } from "./transform-panel";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaGridProps {
  initialAssets: any[];
}

export const MediaGrid = ({ initialAssets }: MediaGridProps) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isTransformOpen, setIsTransformOpen] = useState(false);

  const filteredAssets = initialAssets.filter((asset) => {
    const matchesSearch = asset.url
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      typeFilter === "all" || asset.type.startsWith(typeFilter);
    return matchesSearch && matchesType;
  });

  const handleTransform = (asset: any) => {
    setSelectedAsset(asset);
    setIsTransformOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Files</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
          <p>No assets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pr-2">
          {filteredAssets.map((asset) => (
            <MediaCard
              key={asset.id}
              asset={asset}
              onTransform={handleTransform}
            />
          ))}
        </div>
      )}

      <TransformPanel
        asset={selectedAsset}
        isOpen={isTransformOpen}
        onClose={() => setIsTransformOpen(false)}
      />
    </div>
  );
};
