"use client";

import { useState, useEffect } from "react";
import { PlatformSelector } from "./platform-selector";
import { PostPreview } from "./post-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MediaUpload } from "@/components/media/media-upload";
import { MediaPickerModal } from "@/components/media/media-picker-modal";
import { X } from "lucide-react";
import { IKImage } from "imagekitio-next";

const PLATFORM_LIMITS: Record<string, number> = {
  twitter: 280,
  instagram: 2200,
  linkedin: 3000,
  facebook: 63206,
};

interface Account {
  id: string;
  platform: string;
  accountName: string;
}

export function ComposerForm() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data));
  }, []);

  const handleGenerateCaption = async () => {
    if (!content && mediaUrls.length === 0) {
      toast.error("Please provide a prompt or upload an image first");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-caption", {
        method: "POST",
        body: JSON.stringify({ prompt: content || "Write a social media caption for this" }),
      });
      const data = await res.json();
      setContent(data.caption);
      toast.success("Caption generated!");
    } catch (error) {
      toast.error("Failed to generate caption");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedAccountIds.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          content,
          mediaUrls,
          platforms: selectedAccountIds.map(id => accounts.find(a => a.id === id)?.platform),
          scheduledAt,
        }),
      });
      if (res.ok) {
        toast.success("Post created successfully!");
        setContent("");
        setMediaUrls([]);
        setSelectedAccountIds([]);
        setScheduledAt(undefined);
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      toast.error("Error creating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlatforms = Array.from(new Set(selectedAccountIds.map(id => accounts.find(a => a.id === id)?.platform).filter(Boolean))) as string[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        <Card className="bg-[#111120] border-[#1e1e2e]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">
              1. Select Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlatformSelector 
              accounts={accounts} 
              selectedAccountIds={selectedAccountIds} 
              onChange={setSelectedAccountIds} 
            />
          </CardContent>
        </Card>

        <Card className="bg-[#111120] border-[#1e1e2e]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">
              2. Content
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#6366f1] text-[#a5b4fc] hover:bg-[#1a1a2e]"
              onClick={handleGenerateCaption}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              AI Assist
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="What's on your mind? Write your post here..." 
              className="min-h-[160px] bg-[#0d0d1a] border-[#1e1e2e] focus:border-[#6366f1] transition-all text-white placeholder:text-[#3f3f5a]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {selectedPlatforms.map(platform => {
                const limit = PLATFORM_LIMITS[platform] || 2000;
                const length = content.length;
                const isOver = length > limit;
                const isWarn = length > limit * 0.9;
                return (
                  <Badge 
                    key={platform} 
                    variant="outline" 
                    className={cn(
                      "bg-[#0d0d1a] border-[#1e1e2e]",
                      isOver ? "border-red-500 text-red-500" : isWarn ? "border-amber-500 text-amber-500" : "text-[#64748b]"
                    )}
                  >
                    {platform}: {length}/{limit}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111120] border-[#1e1e2e]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">
              3. Media
            </CardTitle>
            <MediaPickerModal 
              selectedUrls={mediaUrls} 
              onSelect={setMediaUrls} 
              maxSelect={selectedPlatforms.includes('instagram') ? 10 : 4}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-[#1e1e2e] group">
                    <IKImage
                      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                      src={url}
                      transformation={[{ width: "200", height: "200", cropMode: "extract" }]}
                      className="object-cover w-full h-full"
                      alt={`Selected media ${index + 1}`}
                    />
                    <button
                      onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {mediaUrls.length < 4 && (
              <MediaUpload 
                onSuccess={(url) => setMediaUrls([...mediaUrls, url])} 
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#111120] border-[#1e1e2e]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">
              4. Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal bg-[#0d0d1a] border-[#1e1e2e] text-white",
                    !scheduledAt && "text-[#64748b]"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledAt ? format(scheduledAt, "PPP") : <span>Post Now</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#0d0d1a] border-[#1e1e2e] text-white">
                <Calendar
                  mode="single"
                  selected={scheduledAt}
                  onSelect={setScheduledAt}
                  initialFocus
                  className="bg-[#0d0d1a]"
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-[#3f3f5a]">
              {scheduledAt ? `Post will be scheduled for ${format(scheduledAt, "PPP")}` : "Post will be published immediately"}
            </p>
          </CardContent>
        </Card>

        <Button 
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:opacity-90 transition-opacity text-white"
          disabled={isSubmitting || selectedAccountIds.length === 0}
          onClick={handleSubmit}
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Publish to ${selectedAccountIds.length} Platform${selectedAccountIds.length === 1 ? '' : 's'}`}
        </Button>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Live Preview</h3>
          </div>
          
          {selectedPlatforms.length > 0 ? (
            <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
              <TabsList className="bg-[#111120] border-[#1e1e2e] w-full justify-start overflow-x-auto p-1 h-auto flex-wrap">
                {selectedPlatforms.map(platform => (
                  <TabsTrigger key={platform} value={platform} className="data-[state=active]:bg-[#1a1a2e] data-[state=active]:text-[#a5b4fc] text-[#64748b] text-xs px-4 py-2">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {selectedPlatforms.map(platform => (
                <TabsContent key={platform} value={platform} className="mt-6">
                  <PostPreview 
                    platform={platform} 
                    content={content} 
                    mediaUrls={mediaUrls} 
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="aspect-[3/4] rounded-2xl border border-[#1e1e2e] border-dashed flex flex-col items-center justify-center text-[#3f3f5a] p-8 text-center bg-[#0d0d1a]/20">
              <div className="w-12 h-12 rounded-full border border-[#1e1e2e] flex items-center justify-center mb-4 text-xl">
                👀
              </div>
              <p className="text-sm font-medium">Select a platform to see a preview</p>
              <p className="text-xs mt-2">Visualizing your content helps ensure it looks great everywhere.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
