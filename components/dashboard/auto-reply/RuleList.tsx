"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Edit2, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Rule {
  id: string;
  name: string;
  triggerType: string;
  isActive: boolean;
  platforms: string[];
  replyMode: string;
}

interface RuleListProps {
  rules: Rule[];
  onUpdate: () => void;
  onEdit: (rule: Rule) => void;
}

export function RuleList({ rules, onUpdate, onEdit }: RuleListProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setIsUpdating(id);
    try {
      const response = await fetch(`/api/auto-reply/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`Rule ${!currentStatus ? "enabled" : "disabled"}`);
        onUpdate();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteRule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      const response = await fetch(`/api/auto-reply/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Rule deleted");
        onUpdate();
      } else {
        toast.error("Failed to delete rule");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (rules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#111120] border border-dashed border-[#1e1e2e] rounded-xl">
        <div className="w-12 h-12 rounded-full bg-[#1a1a2e] flex items-center justify-center mb-4">
          <MessageSquare className="w-6 h-6 text-[#6366f1]" />
        </div>
        <h3 className="text-lg font-medium">No rules created yet</h3>
        <p className="text-[#64748b] text-sm mt-1">
          Create your first auto-reply rule to automate your engagement.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className="bg-[#111120] border border-[#1e1e2e] rounded-xl p-6 hover:border-[#2e2e4e] transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">{rule.name}</h3>
              <div className="flex gap-2 mt-1">
                {rule.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#1a1a2e] text-[#64748b]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748b]">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0d0d1a] border-[#1e1e2e]">
                <DropdownMenuItem
                  onClick={() => onEdit(rule)}
                  className="text-sm focus:bg-[#1a1a2e] focus:text-white cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Rule
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteRule(rule.id)}
                  className="text-sm text-red-400 focus:bg-[#1a1a2e] focus:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Rule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#64748b]">Trigger</span>
              <span className="font-medium capitalize">
                {rule.triggerType.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#64748b]">Mode</span>
              <span className="font-medium capitalize">
                {rule.replyMode.replace("_", " ")}
              </span>
            </div>
            <div className="pt-4 border-t border-[#1e1e2e] flex justify-between items-center">
              <span className="text-sm font-medium">
                {rule.isActive ? "Active" : "Disabled"}
              </span>
              <Switch
                checked={rule.isActive}
                onCheckedChange={() => toggleStatus(rule.id, rule.isActive)}
                disabled={isUpdating === rule.id}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
