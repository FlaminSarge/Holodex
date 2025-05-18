import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shadcn/ui/command";
import { useState } from "react";
import {
  IdentifiedItunesTrack,
  IdentifiedTrack,
  useSongAutocomplete,
} from "./songSearch.service";
import { useDebounceValue } from "usehooks-ts";
import { localeAtom } from "@/store/i18n";
import { useAtomValue } from "jotai";

export function ItunesSearchDropdown({
  onSelectItem,
  className,
}: {
  className?: string;
  onSelectItem?: (item: IdentifiedTrack) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [open, setOpen] = useState(false);

  const { data: autocomplete, isLoading } = useSongAutocomplete(
    debouncedSearch,
    {
      enabled: !!debouncedSearch,
    },
  );

  const handleItemSelect = (item: IdentifiedTrack) => {
    console.log(item);
    onSelectItem?.(item);
    setOpen(false); // Close dropdown after selection
  };
  return (
    <Command
      className={cn("relative overflow-visible bg-transparent", className)}
      shouldFilter={false}
    >
      <CommandInput
        wrapperClassName="border border-base rounded-md focus-within:ring-2 focus-within:"
        id="itunes_search"
        className=""
        placeholder="Search for existing song..."
        value={search}
        onValueChange={setSearch}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
      />
      {open &&
        (autocomplete?.length ? (
          <CommandList className="absolute w-full border border-base top-10 z-10 rounded-b-md border-solid">
            <CommandGroup heading={<div>Search Results</div>} />
            <CommandSeparator />
            <CommandGroup className="h-full">
              {autocomplete?.map((item, i) => (
                <CommandItem
                  onSelectCapture={(v) => {
                    console.log(v);
                    handleItemSelect(item);
                  }}
                  key={item.trackId ?? item.trackName + i}
                  value={String(i)}
                >
                  <SongItem {...item} />
                </CommandItem>
              ))}
            </CommandGroup>
            {/* </div> */}
          </CommandList>
        ) : (
          <CommandList>
            <CommandEmpty />
          </CommandList>
        ))}
    </Command>
  );
}

function SongItem({
  artworkUrl100,
  trackName,
  artistName,
  collectionName,
  releaseDate,
}: Pick<
  IdentifiedItunesTrack,
  | "artworkUrl100"
  | "trackName"
  | "artistName"
  | "collectionName"
  | "releaseDate"
>) {
  const { dayjs } = useAtomValue(localeAtom);

  return (
    <div className="flex items-center justify-center gap-2">
      <img className="rounded-sm h-10 w-10" src={artworkUrl100 || ""} />
      <div className="flex flex-col">
        <span className="font-bold">{trackName}</span>
        <span className="text-sm">
          {artistName} / {collectionName} /{" "}
          {dayjs(releaseDate).format("YYYY-MM")}
        </span>
      </div>
    </div>
  );
}

// Assuming `item` is passed as a prop to this component and is of type IdentifiedTrack | IdentifiedItunesTrack
const TrackItem = ({ item }: { item: IdentifiedItunesTrack }) => {
  const formatDuration = (milliseconds: number) => {
    // Convert milliseconds to minutes:seconds format
    let seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex w-full gap-2 flex-row">
      <div className="h-10 w-10">
        {item.artworkUrl100 && (
          <img
            src={item.artworkUrl100}
            alt={item.trackName}
            className="h-full w-full rounded object-cover"
          />
        )}
      </div>

      <div className="grow">
        <div className="font-bold float-right">
          {formatDuration(item.trackTimeMillis)}
        </div>
        <div className="">
          <div className="text-sm mr-1 inline-block i-heroicons:musical-note -mb-1"></div>
          <span className="font-bold">{item.trackName}</span>
        </div>
        {/* float the duration to the right instead */}
        <div className="text-xs">
          🎤 {item.artistName}
          {item.collectionName && ` / ${item.collectionName}`}
          {item.releaseDate ? ` / ${item.releaseDate.slice(0, 7)}` : ""}
          <span
            className="inline-block rounded text-xs font-bold ml-5 px-1"
            style={{ fontSize: "0.75rem" }}
          >
            {item.src}
          </span>
        </div>
      </div>
    </div>
  );
};
