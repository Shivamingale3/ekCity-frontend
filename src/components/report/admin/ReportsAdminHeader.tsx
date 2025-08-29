import { ReportMediaType, ReportStatus } from "@/types/report.types";
import { type Dispatch, type SetStateAction } from "react";
import AnonymousFilter from "./AnonymousFilter";
import DateFilter from "./DateFilter";
import MediaTypeFilter from "./MediaTypeFilter";
import ReportStatusFilter from "./ReportStatusFilter";
import SearchBar from "./SearchBar";

function ReportsAdminHeader({
  isAnonymous,
  setIsAnonymous,
  mediaType,
  setMediaType,
  setStatus,
  status,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  search,
  setSearch,
}: {
  isAnonymous: boolean;
  setIsAnonymous: Dispatch<SetStateAction<boolean>>;
  mediaType: ReportMediaType | null;
  setMediaType: Dispatch<SetStateAction<ReportMediaType | null>>;
  status: ReportStatus | null;
  setStatus: Dispatch<SetStateAction<ReportStatus | null>>;
  dateFrom: Date;
  dateTo: Date;
  setDateFrom: Dispatch<SetStateAction<Date>>;
  setDateTo: Dispatch<SetStateAction<Date>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="w-full p-2 flex justify-between items-center rounded-md gap-5 border">
      <p className="text-xl font-bold pl-9">Reports</p>
      <div className="w-max px-10 py-2 flex justify-end items-center gap-5 bg-[#353535] rounded-md">
        <SearchBar search={search} setSearch={setSearch} />
        <AnonymousFilter
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />
        <MediaTypeFilter mediaType={mediaType} setMediaType={setMediaType} />
        <ReportStatusFilter
          status={status}
          setStatus={setStatus}
          allRequired={true}
        />
        <DateFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
        />
      </div>
    </div>
  );
}

export default ReportsAdminHeader;
