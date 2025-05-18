import { Badge } from "@/shadcn/ui/badge";
import { QueryItem } from "../types";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";

export function QueryBadge({
  item,
  onRemoveItem,
}: {
  item: PrimitiveAtom<QueryItem>;
  onRemoveItem: () => void;
}) {
  const queryItem = useAtomValue(item);
  const { t } = useTranslation();

  return (
    <Badge
      key={queryItem.type + queryItem.value}
      variant="primary"
      className="px-1 font-normal tracking-tight"
    >
      {t(`search.class.${queryItem.type}`, queryItem.type)}
      {": "}
      {queryItem.text === "$t"
        ? t(`search.class_values.${queryItem.type}.${queryItem.value}`, " ")
        : queryItem.text === "?"
          ? queryItem.value
          : queryItem.text}
      <button
        className="rounded-full focus:ring-2 focus:ring-offset-2 focus: ml-1 outline-hidden ring-offset-base-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onRemoveItem();
          }
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={onRemoveItem}
      >
        <div className="i-lucide:x text-sm hover: h-3 w-3"></div>
      </button>
    </Badge>
  );
}
