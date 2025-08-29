import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const DateFilter = ({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
}: {
  dateFrom: Date;
  dateTo: Date;
  setDateFrom: Dispatch<SetStateAction<Date>>;
  setDateTo: Dispatch<SetStateAction<Date>>;
}) => {
  // From states
  const [openFrom, setOpenFrom] = useState(false);
  const [monthFrom, setMonthFrom] = useState<Date | undefined>(dateFrom);

  // To states
  const [openTo, setOpenTo] = useState(false);
  const [monthTo, setMonthTo] = useState<Date | undefined>(dateTo);

  return (
    <div className="flex justify-center items-center gap-5">
      {/* From date */}
      <div className="flex justify-start items-center gap-3">
        <Label className="px-1">From:</Label>
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-start p-6"
              onClick={() => setOpenFrom(true)}
            >
              <CalendarIcon className="size-4 opacity-70" />
              {dateFrom ? formatDate(dateFrom) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="start"
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={dateFrom}
              captionLayout="dropdown"
              month={monthFrom}
              onMonthChange={setMonthFrom}
              onSelect={(date) => {
                if (date) {
                  setDateFrom(date);
                  setOpenFrom(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* To date */}
      <div className="flex justify-start items-center gap-3">
        <Label className="px-1">To:</Label>
        <Popover open={openTo} onOpenChange={setOpenTo}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-start p-6"
              onClick={() => setOpenTo(true)}
            >
              <CalendarIcon className="size-4 opacity-70" />
              {dateTo ? formatDate(dateTo) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="start"
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={dateTo}
              captionLayout="dropdown"
              month={monthTo}
              onMonthChange={setMonthTo}
              onSelect={(date) => {
                if (date) {
                  setDateTo(date);
                  setOpenTo(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateFilter;
