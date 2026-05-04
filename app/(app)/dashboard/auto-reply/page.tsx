"use client";

import { useEffect, useState } from "react";
import { Plus, Settings2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RuleList } from "@/components/dashboard/auto-reply/RuleList";
import { RuleBuilder } from "@/components/dashboard/auto-reply/RuleBuilder";
import { ReplyHistory } from "@/components/dashboard/auto-reply/ReplyHistory";
import { toast } from "sonner";

export default function AutoReplyPage() {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/auto-reply");
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      toast.error("Failed to load rules");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreateNew = () => {
    setEditingRule(null);
    setIsBuilderOpen(true);
  };

  const handleEditRule = (rule: any) => {
    setEditingRule(rule);
    setIsBuilderOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Auto-Reply Rules</h1>
          <p className="text-[#64748b] mt-2">
            Automate your social media engagement with smart reply rules and Gemini AI.
          </p>
        </div>
        <Button 
          onClick={handleCreateNew}
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Rule
        </Button>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="bg-[#111120] border border-[#1e1e2e] p-1 h-auto">
          <TabsTrigger 
            value="rules" 
            className="data-[state=active]:bg-[#1a1a2e] data-[state=active]:text-[#a5b4fc] px-4 py-2 flex items-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-[#1a1a2e] data-[state=active]:text-[#a5b4fc] px-4 py-2 flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            Reply History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[200px] bg-[#111120] border border-[#1e1e2e] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <RuleList 
              rules={rules} 
              onUpdate={fetchRules} 
              onEdit={handleEditRule}
            />
          )}
        </TabsContent>

        <TabsContent value="history">
          <ReplyHistory />
        </TabsContent>
      </Tabs>

      <RuleBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSave={fetchRules}
        editingRule={editingRule}
      />
    </div>
  );
}
