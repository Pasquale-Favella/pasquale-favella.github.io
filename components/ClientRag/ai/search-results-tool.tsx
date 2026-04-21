'use client';

import { SearchResult } from "../util/document-processor";
import { Sources, SourcesTrigger, SourcesContent, Source } from "./sources";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { Loader } from "./loader";

interface ToolUIPart {
  type: string;
  state: "input-streaming" | "output-available" | "error";
  input?: { query: string };
  output?: SearchResult[];
  errorText?: string;
}

export function SearchResultsTool({ part }: { part: ToolUIPart }) {
  // Handle input streaming state
  if (part.state === "input-streaming") {
    return (
      <div className="flex items-center gap-2 text-sm text-base-content/70">
        <Loader className="size-4" />
        Searching documents...
      </div>
    );
  }

  // Handle error state
  if (part.state === "error") {
    return (
      <div className="flex items-center gap-2 rounded-md bg-error/10 p-3 text-sm text-error">
        <span>⚠️</span>
        <span>{part.errorText || "Error searching documents"}</span>
      </div>
    );
  }

  // Handle success state with results
  if (part.state === "output-available" && part.output) {
    const results = part.output as SearchResult[];

    if (results.length === 0) {
      return (
        <div className="text-sm text-base-content/70">
          No relevant documents found.
        </div>
      );
    }

    return (
      <TooltipProvider>
        <Sources>
          <SourcesTrigger count={results.length} />
          <SourcesContent>
            {results.map((doc) => {
              const filename = doc.metadata?.filename || `Document ${doc.id}`;
              const chunkInfo =
                doc.metadata?.chunkIndex !== undefined &&
                doc.metadata?.totalChunks !== undefined
                  ? ` (chunk ${doc.metadata.chunkIndex + 1}/${doc.metadata.totalChunks})`
                  : "";

              return (
                <Tooltip key={doc.id}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Source
                        title={`${filename}${chunkInfo}`}
                        className="flex gap-1 text-xs text-base-content hover:text-primary transition-colors cursor-pointer"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md p-3">
                    <p className="text-sm">{doc.content}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </SourcesContent>
        </Sources>
      </TooltipProvider>
    );
  }

  return null;
}
