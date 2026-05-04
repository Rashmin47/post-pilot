"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { X } from "lucide-react";

interface RuleBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingRule?: any;
}

const PLATFORMS = [
  { id: "twitter", name: "Twitter / X" },
  { id: "instagram", name: "Instagram" },
  { id: "facebook", name: "Facebook" },
  { id: "linkedin", name: "LinkedIn" },
];

export function RuleBuilder({ isOpen, onClose, onSave, editingRule }: RuleBuilderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    triggerType: "keyword_match",
    keywords: [] as string[],
    replyMode: "template",
    replyTemplate: "",
    platforms: ["twitter"],
    isActive: true,
  });
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    if (editingRule) {
      setFormData({
        name: editingRule.name || "",
        triggerType: editingRule.triggerType || "keyword_match",
        keywords: editingRule.keywords || [],
        replyMode: editingRule.replyMode || "template",
        replyTemplate: editingRule.replyTemplate || "",
        platforms: editingRule.platforms || ["twitter"],
        isActive: editingRule.isActive !== undefined ? editingRule.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        triggerType: "keyword_match",
        keywords: [],
        replyMode: "template",
        replyTemplate: "",
        platforms: ["twitter"],
        isActive: true,
      });
    }
  }, [editingRule, isOpen]);

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== kw),
    });
  };

  const togglePlatform = (id: string) => {
    const platforms = formData.platforms.includes(id)
      ? formData.platforms.filter((p) => p !== id)
      : [...formData.platforms, id];
    setFormData({ ...formData, platforms });
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please enter a rule name");
      return;
    }

    setIsLoading(true);
    try {
      const url = editingRule ? `/api/auto-reply/${editingRule.id}` : "/api/auto-reply";
      const method = editingRule ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingRule ? "Rule updated" : "Rule created");
        onSave();
        onClose();
      } else {
        toast.error("Failed to save rule");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-[#0d0d1a] border-l border-[#1e1e2e] sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingRule ? "Edit Rule" : "Create Auto-Reply Rule"}</SheetTitle>
          <SheetDescription>
            Configure how PostPilot should automatically respond to comments.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              placeholder="e.g., Welcome New Followers"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#111120] border-[#1e1e2e]"
            />
          </div>

          <div className="space-y-2">
            <Label>Platform Scope</Label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    formData.platforms.includes(p.id)
                      ? "bg-[#6366f1] text-white"
                      : "bg-[#111120] text-[#64748b] border border-[#1e1e2e]"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="triggerType">Trigger Type</Label>
            <Select
              value={formData.triggerType}
              onValueChange={(val) => setFormData({ ...formData, triggerType: val })}
            >
              <SelectTrigger className="bg-[#111120] border-[#1e1e2e]">
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d0d1a] border-[#1e1e2e]">
                <SelectItem value="keyword_match">Keyword Match</SelectItem>
                <SelectItem value="any_comment">Any Comment</SelectItem>
                <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.triggerType === "keyword_match" && (
            <div className="space-y-2">
              <Label>Keywords (Press Enter to add)</Label>
              <div className="flex flex-wrap gap-2 p-2 bg-[#111120] border border-[#1e1e2e] rounded-md min-h-[40px]">
                {formData.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 px-2 py-0.5 bg-[#1a1a2e] text-[#a5b4fc] text-xs rounded"
                  >
                    {kw}
                    <button onClick={() => removeKeyword(kw)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  className="bg-transparent border-none outline-none text-sm flex-1 min-w-[80px]"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                  placeholder={formData.keywords.length === 0 ? "e.g., price, info" : ""}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="replyMode">Reply Mode</Label>
            <Select
              value={formData.replyMode}
              onValueChange={(val) => setFormData({ ...formData, replyMode: val })}
            >
              <SelectTrigger className="bg-[#111120] border-[#1e1e2e]">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d0d1a] border-[#1e1e2e]">
                <SelectItem value="template">Use Template</SelectItem>
                <SelectItem value="ai_generated">AI Generated (Gemini)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.replyMode === "template" ? (
            <div className="space-y-2">
              <Label htmlFor="template">Reply Template</Label>
              <Textarea
                id="template"
                placeholder="Write your response here..."
                value={formData.replyTemplate}
                onChange={(e) => setFormData({ ...formData, replyTemplate: e.target.value })}
                className="bg-[#111120] border-[#1e1e2e] min-h-[100px]"
              />
            </div>
          ) : (
            <div className="p-4 bg-[#1a1a2e]/50 border border-[#6366f1]/20 rounded-lg">
              <p className="text-xs text-[#a5b4fc]">
                Gemini AI will analyze the comment and generate a natural response based on the rule name and platform context.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <Label>Active</Label>
              <p className="text-xs text-[#64748b]">Rule will start processing immediately.</p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
            />
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1e1e2e] hover:bg-[#111120]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#6366f1] hover:bg-[#4f46e5]"
          >
            {isLoading ? "Saving..." : editingRule ? "Update Rule" : "Create Rule"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
