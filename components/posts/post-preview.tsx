"use client";

import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Send, Share2 } from "lucide-react";

interface PostPreviewProps {
  content: string;
  mediaUrls: string[];
  platform: string;
}

export function PostPreview({ content, mediaUrls, platform }: PostPreviewProps) {
  return (
    <div className="bg-[#111120] border border-[#1e1e2e] rounded-2xl overflow-hidden max-w-[400px] mx-auto shadow-xl">
      {/* Platform Indicator */}
      <div className="px-4 py-2 bg-[#1a1a2e] border-b border-[#1e1e2e] flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1]">{platform} Preview</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#1e1e2e]" />
          <div className="w-2 h-2 rounded-full bg-[#1e1e2e]" />
          <div className="w-2 h-2 rounded-full bg-[#1e1e2e]" />
        </div>
      </div>

      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#a855f7]" />
        <div>
          <div className="text-sm font-bold text-white">Your Brand</div>
          <div className="text-xs text-[#64748b]">@yourbrand</div>
        </div>
        <div className="ml-auto text-[#3f3f5a]">•••</div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-[#e2e8f0] whitespace-pre-wrap leading-relaxed">
          {content || "Your post content will appear here..."}
        </p>
      </div>

      {/* Media */}
      {mediaUrls.length > 0 ? (
        <div className="aspect-square bg-[#0d0d1a] relative">
          <img 
            src={mediaUrls[0]} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-[#0d0d1a] flex items-center justify-center border-y border-[#1e1e2e]">
          <span className="text-xs text-[#3f3f5a]">No media attached</span>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex items-center justify-between border-t border-[#1e1e2e] bg-[#0d0d1a]/50">
        <div className="flex gap-6">
          <div className="flex items-center gap-1.5 group cursor-pointer">
            <Heart className="w-5 h-5 text-[#64748b] group-hover:text-red-500 transition-colors" />
            <span className="text-[10px] text-[#3f3f5a] group-hover:text-red-500">0</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-pointer">
            <MessageCircle className="w-5 h-5 text-[#64748b] group-hover:text-[#6366f1] transition-colors" />
            <span className="text-[10px] text-[#3f3f5a] group-hover:text-[#6366f1]">0</span>
          </div>
          <div className="flex items-center gap-1.5 group cursor-pointer">
            <Send className="w-5 h-5 text-[#64748b] group-hover:text-[#6366f1] transition-colors" />
          </div>
        </div>
        <Share2 className="w-5 h-5 text-[#64748b] cursor-pointer hover:text-[#6366f1] transition-colors" />
      </div>
    </div>
  );
}
