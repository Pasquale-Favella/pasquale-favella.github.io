import { SearchResult } from "../util/document-processor";
import { Sources, SourcesTrigger, SourcesContent, Source } from "./sources";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";

export function RagSources({ metadata }: { metadata: any }) {
    if (!metadata) return null;

    const relevantDocs: SearchResult[] | undefined = metadata?.relevantDocs;
    
    if (!relevantDocs || relevantDocs.length === 0) return null;

    return (
        <TooltipProvider>
            <Sources>
                <SourcesTrigger count={relevantDocs.length} />
                <SourcesContent>
                    {relevantDocs.map((doc) => {
                        const filename = doc.metadata?.filename || `Document ${doc.id}`;
                        const chunkInfo = doc.metadata?.chunkIndex !== undefined && doc.metadata?.totalChunks !== undefined
                            ? ` (chunk ${doc.metadata.chunkIndex + 1}/${doc.metadata.totalChunks})`
                            : '';
                        
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