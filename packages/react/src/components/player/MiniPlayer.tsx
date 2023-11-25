import { currentVideoAtom } from "@/store/player";
import { useAtomValue } from "jotai";
import { Link } from "react-router-dom";
import { DefaultPlayerFrame } from "./DefaultPlayerFrame";

export function MiniPlayer() {
  const currentVideo = useAtomValue(currentVideoAtom);

  return (
    <div className="fixed inset-x-4 bottom-0 flex flex-col overflow-hidden rounded-t-lg bg-base sm:left-auto sm:w-96">
      <DefaultPlayerFrame className="aspect-video w-full" />
      <div className="flex flex-col p-4">
        <Link
          to={`/watch/${currentVideo?.id}`}
          className="line-clamp-1 font-bold"
        >
          {currentVideo?.title}
        </Link>
        <Link
          to={`/channel/${currentVideo?.channel?.id}`}
          className="text-sm text-base-11"
        >
          {currentVideo?.channel?.name}
        </Link>
      </div>
    </div>
  );
}
