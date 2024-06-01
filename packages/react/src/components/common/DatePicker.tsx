import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Calendar } from "@/shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { DayPickerSingleProps } from "react-day-picker";
import dayjs from "dayjs";
import { Input } from "@/shadcn/ui/input";
import { useTranslation } from "react-i18next";

export function DatePicker(
  props: Omit<DayPickerSingleProps, "mode" | "onSelect"> & {
    timezone?: string;
    onSelect: (date: Date) => void;
  },
) {
  const { t } = useTranslation();
  // date is UTC time
  const { selected: date, onSelect, timezone } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn(
            "w-full justify-start text-left font-normal border-base-6 focus:border-blue-6",
            !date && "text-base-11",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            dayjs(date).tz(timezone).format("YYYY-MM-DD HH:mm")
          ) : (
            <span>{t("component.datePicker.pickDate")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          {...props}
          // "day" is local date
          onSelect={(day) => {
            if (day)
              onSelect(
                dayjs
                  .tz(
                    `${day.getFullYear()}-${
                      Number(day.getMonth()) + 1
                    }-${day.getDate()}`,
                    timezone,
                  )
                  .toDate(),
              );
          }}
        />
        <div className="px-4 pb-4">
          <Input
            value={dayjs(date).tz(timezone).format("HH:mm")}
            onChange={(e) => {
              const currentDate = dayjs(date).tz(timezone);
              const selectedDate = dayjs.tz(e.target.valueAsDate, "UTC");
              onSelect(
                dayjs
                  .tz(
                    currentDate.startOf("day").valueOf() +
                      selectedDate.valueOf(),
                    timezone,
                  )
                  .toDate(),
              );
            }}
            type="time"
            step="60"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}