"use client";

import { Square, CheckSquare, WrenchIcon, ChevronDownIcon } from "lucide-react";
import { Tool, ToolContent } from "@/components/ai-elements/tool";
import { CollapsibleTrigger } from "@/components/ui/shadcn/collapsible";
import { cn } from "@/lib/utils";
import type { ToolUIPart } from "ai";

type ScoutData = {
  title?: string;
  goal?: string;
  description?: string;
  location?: {
    city: string;
    latitude: number;
    longitude: number;
  } | null;
  search_queries?: string[];
  frequency?: "hourly" | "every_3_days" | "weekly" | null;
};

type ScoutChecklistToolProps = {
  toolPart?: ToolUIPart;
  currentScout: ScoutData;
};

export function ScoutChecklistTool({
  toolPart,
  currentScout,
}: ScoutChecklistToolProps) {
  void toolPart; // Unused but part of the props interface
  const checklistItems = [
    {
      label: "Title",
      value: currentScout.title,
      filled: Boolean(currentScout.title),
      description: currentScout.title || "Not set",
    },
    {
      label: "Goal",
      value: currentScout.goal,
      filled: Boolean(currentScout.goal),
      description: currentScout.goal || "Not set",
    },
    {
      label: "Description",
      value: currentScout.description,
      filled: Boolean(currentScout.description),
      description: currentScout.description || "Not set",
    },
    {
      label: "Location",
      value: currentScout.location,
      filled: Boolean(currentScout.location),
      description: currentScout.location?.city || "Not set",
    },
    {
      label: "Search Queries",
      value: currentScout.search_queries,
      filled: Boolean(
        currentScout.search_queries && currentScout.search_queries.length > 0,
      ),
      description:
        currentScout.search_queries && currentScout.search_queries.length > 0
          ? currentScout.search_queries.join(", ")
          : "Not set",
    },
    {
      label: "Frequency",
      value: currentScout.frequency,
      filled: Boolean(currentScout.frequency),
      description: currentScout.frequency
        ? currentScout.frequency
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
        : "Not set",
    },
  ];

  const completedCount = checklistItems.filter((item) => item.filled).length;
  const totalCount = checklistItems.length;

  return (
    <Tool defaultOpen>
      <CollapsibleTrigger
        className={cn("flex w-full items-center justify-between gap-16 p-12")}
      >
        <div className="flex items-center gap-8">
          <WrenchIcon className="w-16 h-16 text-muted-foreground" />
          <span className="font-medium text-body-medium">
            Scout Configuration
          </span>
          <span className="text-body-small text-muted-foreground ml-8">
            {completedCount}/{totalCount}
          </span>
        </div>
        <ChevronDownIcon className="w-16 h-16 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <ToolContent>
        <div className="p-12 pt-0">
          <div className="space-y-6">
            {checklistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-8 p-4 rounded-4 hover:bg-muted/30 transition-colors"
              >
                {item.filled ? (
                  <CheckSquare className="w-16 h-16 text-primary mt-2 shrink-0" />
                ) : (
                  <Square className="w-16 h-16 text-muted-foreground/50 mt-2 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-8">
                    <span
                      className={`text-body-small font-bold! ${item.filled ? "text-foreground font-medium" : "text-muted-foreground"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p
                    className={`text-body-small mt-2 ${item.filled ? "text-muted-foreground" : "text-muted-foreground/60"}`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ToolContent>
    </Tool>
  );
}
