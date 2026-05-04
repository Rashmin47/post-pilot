"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { MessageCircle, ExternalLink } from "lucide-react";

interface Log {
  id: string;
  platform: string;
  commentId: string;
  commentText: string;
  replyText: string;
  sentAt: string;
  ruleName: string;
}

export function ReplyHistory() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/auto-reply/logs");
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-[#111120] border border-[#1e1e2e] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#111120] border border-dashed border-[#1e1e2e] rounded-xl">
        <div className="w-12 h-12 rounded-full bg-[#1a1a2e] flex items-center justify-center mb-4">
          <MessageCircle className="w-6 h-6 text-[#64748b]" />
        </div>
        <h3 className="text-lg font-medium">No replies sent yet</h3>
        <p className="text-[#64748b] text-sm mt-1">
          Once your rules start matching comments, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#111120] border border-[#1e1e2e] rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-[#1a1a2e]/50">
          <TableRow className="border-[#1e1e2e] hover:bg-transparent">
            <TableHead>Date</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>AI Reply</TableHead>
            <TableHead>Rule</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="border-[#1e1e2e] hover:bg-[#1a1a2e]/30">
              <TableCell className="text-xs text-[#64748b]">
                {format(new Date(log.sentAt), "MMM d, HH:mm")}
              </TableCell>
              <TableCell>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#1a1a2e] text-[#64748b]">
                  {log.platform}
                </span>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm" title={log.commentText}>
                {log.commentText}
              </TableCell>
              <TableCell className="max-w-[250px] truncate text-sm text-[#a5b4fc]" title={log.replyText}>
                {log.replyText}
              </TableCell>
              <TableCell className="text-sm font-medium">
                {log.ruleName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
