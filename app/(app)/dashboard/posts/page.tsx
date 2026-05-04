"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { CheckCircle2, Clock, RefreshCcw, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Post {
  id: string;
  content: string;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  platforms: string[];
  createdAt: string;
}

const platformIcons: Record<string, string> = {
  twitter: "🐦",
  instagram: "📸",
  facebook: "👤",
  linkedin: "💼",
  youtube: "📺",
  pinterest: "📌",
  discord: "💬",
  slack: "🏘️",
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
        toast.success("Post deleted");
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Published</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20"><Clock className="w-3 h-3 mr-1" /> Scheduled</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-[#64748b] border-[#1e1e2e]">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === "all") return true;
    return post.status === activeTab;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Post History</h1>
          <p className="text-[#64748b] mt-2">Manage and track your social media activity across all platforms.</p>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#111120] border border-[#1e1e2e] p-1 h-auto mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#1a1a2e] data-[state=active]:text-[#a5b4fc] px-6 py-2">All Posts</TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-[#1a1a2e] data-[state=active]:text-[#a5b4fc] px-6 py-2">Scheduled</TabsTrigger>
          <TabsTrigger value="published" className="data-[state=active]:bg-[#1a1a2e] data-[state=active]:text-[#a5b4fc] px-6 py-2">Published</TabsTrigger>
          <TabsTrigger value="failed" className="data-[state=active]:bg-[#1a1a2e] data-[state=active]:text-[#a5b4fc] px-6 py-2">Failed</TabsTrigger>
        </TabsList>

        <Card className="bg-[#111120] border-[#1e1e2e] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[#1e1e2e] hover:bg-transparent">
                <TableHead className="text-[#64748b] font-semibold py-4">Platforms</TableHead>
                <TableHead className="text-[#64748b] font-semibold">Content Preview</TableHead>
                <TableHead className="text-[#64748b] font-semibold">Status</TableHead>
                <TableHead className="text-[#64748b] font-semibold">Time</TableHead>
                <TableHead className="text-[#64748b] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-[#1e1e2e]">
                    <TableCell colSpan={5} className="h-20 animate-pulse bg-[#0d0d1a]/50" />
                  </TableRow>
                ))
              ) : filteredPosts.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-48 text-center text-[#3f3f5a]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-sm font-medium">No posts found in this category</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id} className="border-[#1e1e2e] hover:bg-[#0d0d1a]/50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex gap-1.5">
                        {post.platforms.map(p => (
                          <div 
                            key={p} 
                            className="w-8 h-8 rounded-lg bg-[#0d0d1a] border border-[#1e1e2e] flex items-center justify-center text-sm shadow-inner" 
                            title={p}
                          >
                            {platformIcons[p] || "🌐"}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[400px]">
                      <p className="truncate text-sm text-[#e2e8f0]">
                        {post.content || <span className="italic text-[#3f3f5a]">No content</span>}
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-[#e2e8f0]">
                          {post.scheduledAt 
                            ? format(new Date(post.scheduledAt), "MMM d, yyyy")
                            : post.publishedAt 
                              ? format(new Date(post.publishedAt), "MMM d, yyyy")
                              : format(new Date(post.createdAt), "MMM d, yyyy")
                          }
                        </span>
                        <span className="text-[10px] text-[#64748b]">
                          {post.scheduledAt 
                            ? format(new Date(post.scheduledAt), "h:mm a")
                            : post.publishedAt 
                              ? format(new Date(post.publishedAt), "h:mm a")
                              : format(new Date(post.createdAt), "h:mm a")
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                         {post.status === 'failed' && (
                           <Button variant="ghost" size="icon" className="h-9 w-9 text-[#6366f1] hover:bg-[#6366f1]/10 rounded-xl" title="Retry">
                             <RefreshCcw className="w-4 h-4" />
                           </Button>
                         )}
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-9 w-9 text-[#64748b] hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                           onClick={() => handleDelete(post.id)}
                           title="Delete"
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </Tabs>
    </div>
  );
}
