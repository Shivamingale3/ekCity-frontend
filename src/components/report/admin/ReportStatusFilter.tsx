import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ReportStatus } from "@/types/report.types";
import type { Dispatch, SetStateAction } from "react";

const ReportStatusFilter = ({
  status,
  setStatus,
  className,
  allRequired,
}: {
  status: ReportStatus | null;
  setStatus: Dispatch<SetStateAction<ReportStatus | null>>;
  className?: string;
  allRequired: boolean;
}) => {
  return (
    <Select
      value={String(status)}
      onValueChange={(value) => {
        if (value === "all") {
          setStatus(null);
        } else {
          setStatus(value as ReportStatus);
        }
      }}
    >
      <SelectTrigger
        className={`${
          className
            ? className
            : "p-6 border w-max px-5 bg-white hover:none hover:bg-white hover:opacity-90 rounded-md"
        }`}
        style={{
          color: className?.includes("text-white") ? "white" : "black",
        }}
      >
        {status ? status.toUpperCase() : "All Status"}
      </SelectTrigger>
      <SelectContent>
        {allRequired && <SelectItem value={"all"}>All</SelectItem>}
        <SelectItem value={ReportStatus.PENDING}>
          {ReportStatus.PENDING.toUpperCase()}
        </SelectItem>
        <SelectItem value={ReportStatus.REJECTED}>
          {ReportStatus.REJECTED.toUpperCase()}
        </SelectItem>
        <SelectItem value={ReportStatus.RESOLVED}>
          {ReportStatus.RESOLVED.toUpperCase()}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ReportStatusFilter;
