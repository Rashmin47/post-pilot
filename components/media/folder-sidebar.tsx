"use client";

import { Folder, HardDrive, Clock, Image as ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FolderSidebarProps {
  className?: string;
}

export const FolderSidebar = ({ className }: FolderSidebarProps) => {
  const folders = [
    { name: "All Assets", icon: HardDrive, active: true },
    { name: "Recent", icon: Clock },
    { name: "Images", icon: ImageIcon },
    { name: "Videos", icon: Video },
  ];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-1">
        {folders.map((folder) => (
          <Button
            key={folder.name}
            variant={folder.active ? "secondary" : "ghost"}
            className="justify-start"
          >
            <folder.icon className="h-4 w-4 mr-2" />
            {folder.name}
          </Button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Folders
        </h3>
        <div className="flex flex-col gap-1">
          <Button variant="ghost" className="justify-start">
            <Folder className="h-4 w-4 mr-2" />
            Marketing
          </Button>
          <Button variant="ghost" className="justify-start">
            <Folder className="h-4 w-4 mr-2" />
            Product Shots
          </Button>
          <Button variant="ghost" className="justify-start text-muted-foreground italic">
            + New Folder
          </Button>
        </div>
      </div>
    </div>
  );
};
