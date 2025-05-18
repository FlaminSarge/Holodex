import { ScrollArea, ScrollBar } from "@/shadcn/ui/scroll-area";
import { ChannelImg } from "../channel/ChannelImg";

export function Mentions({ mentions }: { mentions: ShortChannel[] }) {
  return (
    <div className="rounded-lg p-1">
      <ScrollArea type="hover" className="p-1">
        <div className="flex w-full gap-2 flex-row">
          {mentions.map((mention) => (
            <ChannelImg
              key={mention.id}
              className="h-14"
              channelId={mention.id}
              photo={mention.photo}
              size={40}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
