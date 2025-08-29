import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getReportsByFilter } from "@/redux/thunks/reportsThunk";
import {
  ReportMediaType,
  ReportStatus,
  type SearchFilterQuery,
} from "@/types/report.types";
import { Loader } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import ReportsAdminHeader from "./ReportsAdminHeader";
import ReportTile from "./ReportTile";
import ViewReportMedia from "./ViewReportMedia";

function ReportsAdminParent() {
  const dispatch = useAppDispatch();
  const { getReportsError, getReportsLoading, reports } = useAppSelector(
    (state) => state.reports
  );
  const [filterParams, setFilterParams] = useState<SearchFilterQuery | null>(
    null
  );
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [mediaType, setMediaType] = useState<ReportMediaType | null>(null);
  const [status, setStatus] = useState<ReportStatus | null>(null);
  const [dateFrom, setDateFrom] = useState<Date>(
    moment().subtract(1, "month").toDate()
  );
  const [search, setSearch] = useState<string>("");
  const [dateTo, setDateTo] = useState<Date>(moment().toDate());
  const [viewReportMedia, setViewReportMedia] = useState({
    open: false,
    media: "",
    mediaType: ReportMediaType.IMAGE,
  });

  // helper to open with data
  const openReportMedia = (media: string, mediaType: ReportMediaType) => {
    setViewReportMedia({ open: true, media, mediaType });
  };

  // helper to just close
  const closeReportMedia = () => {
    setViewReportMedia((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (filterParams) {
      dispatch(getReportsByFilter({ filter: filterParams }));
    }
  }, [filterParams]);

  useEffect(() => {
    setFilterParams({
      reportTitle: search ? search : undefined,
      userId: isAnonymous ? "true" : "false",
      mediaType: mediaType ? mediaType : undefined,
      status: status ? status : undefined,
      createdAtFrom: dateFrom.toISOString(),
      createdAtTo: dateTo.toISOString(),
    });
  }, [isAnonymous, mediaType, status, dateFrom, dateTo, search]);
  console.log(viewReportMedia);
  return (
    <>
      <div className="w-full h-full p-2 flex flex-col justify-start items-center gap-2">
        <div className="w-full">
          <ReportsAdminHeader
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
            mediaType={mediaType}
            setMediaType={setMediaType}
            setStatus={setStatus}
            status={status}
            dateFrom={dateFrom}
            dateTo={dateTo}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="w-full h-full overflow-y-auto border rounded-md flex justify-center items-center">
          {getReportsLoading === true ? (
            <>
              <Loader className="animate-spin" />
              Loading . . .
            </>
          ) : getReportsError && getReportsError !== null ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">{getReportsError}</p>
            </div>
          ) : reports && reports.length === 0 ? (
            <p>No Reports</p>
          ) : (
            <div className="w-full h-full flex flex-col justify-start items-center gap-5 p-5">
              {reports.map((report) => (
                <ReportTile
                  key={report.id}
                  report={report}
                  openReportMedia={openReportMedia}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ViewReportMedia
        viewReportMedia={viewReportMedia}
        closeReportMedia={closeReportMedia}
      />
    </>
  );
}

export default ReportsAdminParent;
