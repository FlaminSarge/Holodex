import * as React from "react";

import { cn } from "@/lib/utils";

import { useOrgs } from "@/services/orgs.service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/shadcn/ui/popover";
import { useTranslation } from "react-i18next";
import { getThumbnailForOrg } from "@/lib/thumb";

export function OrgSelectorCombobox({
  org,
  setOrg,
}: {
  org?: Org;
  setOrg?: (org: Org) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(org?.name || "");

  // Use the useOrgs API service to fetch organizations
  const { data: orgs, isError, refetch } = useOrgs({ enabled: open });

  if (isError) {
    return <div onClick={() => refetch()}>Connection Error</div>;
  }

  // If orgs is undefined or empty, show a loading state or empty state
  if (!orgs || orgs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "inline-flex min-h-8 w-full items-center justify-between rounded-md  py-1 pl-4 pr-2",
            "text-left text-lg font-medium  transition",
            "hover: focus-visible:outline-hidden focus-visible:ring-1 focus-visible: active:scale-[97%] active: disabled:pointer-events-none disabled:opacity-50",
            open && " ring-2  hover:",
          )}
        >
          {t("Go to...")}
          <div className="ml-2 inline-block h-4 w-4 shrink-0 align-middle opacity-50 i-lucide:chevrons-up-down"></div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[80vw] p-0">
        <Command>
          <CommandInput placeholder={t("Search organization...")} />
          <CommandList className="max-h-96 sm:max-h-96 lg:max-h-[min(480px,50vh)]">
            <CommandEmpty>{t("No organization found.")}</CommandEmpty>
            <CommandGroup>
              {orgs.map((org) => (
                <CommandItem
                  key={org.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setOrg?.(org);
                  }}
                >
                  <img
                    className="mr-2 h-8 w-8 rounded-full"
                    src={getThumbnailForOrg(org.icon)}
                  ></img>
                  {org.name}
                  <div
                    className={cn(
                      "i-lucide:check ml-auto h-4 w-4",
                      value === org.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
