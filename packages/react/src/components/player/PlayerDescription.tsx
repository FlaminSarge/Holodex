import { cn } from "@/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { useState } from "react";
import { LinkItUrl, LinkItTwitter } from "react-linkify-it";

export function PlayerDescription({
  description,
  defaultExpanded = false,
  lines = 3,
}: {
  description: string;
  defaultExpanded?: boolean;
  lines?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-base-3 p-4">
      <div
        className={cn("whitespace-pre-wrap break-all text-sm", {
          "line-clamp-3": !isExpanded,
        })}
      >
        <LinkItUrl className="text-primary underline hover:text-primary-12">
          <LinkItTwitter className="text-primary underline hover:text-primary-12">
            {description}
          </LinkItTwitter>
        </LinkItUrl>
      </div>
      {description.split(/\r\n|\r|\n/).length > lines && (
        <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
}
