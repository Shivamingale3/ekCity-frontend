import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch } from "@/redux/store";
import { updateReportStatus } from "@/redux/thunks/reportsThunk";
import { getUserById } from "@/redux/thunks/userThunk";
import type { User } from "@/types/authTypes";
import {
  ReportMediaType,
  ReportStatus,
  type Report,
} from "@/types/report.types";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ReportStatusFilter from "./ReportStatusFilter";
import ReporterIndicator from "./ReporterIndicator";

const ReportTile = ({
  report,
  openReportMedia,
}: {
  report: Report;
  openReportMedia: (media: string, mediaType: ReportMediaType) => void;
}) => {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [status, setStatus] = useState<ReportStatus | null>(report.status);
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    try {
      if (!report.userId) return;
      const response = await dispatch(
        getUserById({
          userId: report.userId,
        })
      );

      if (getUserById.fulfilled.match(response)) {
        setUser(response.payload.data);
      }
    } catch (error) {
      toast.error("Failed to get user!");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const updateStatus = async () => {
    try {
      if (!status || report.status === status) return;
      const reponse = await dispatch(
        updateReportStatus({
          reportId: report.id,
          status: status,
        })
      );
      if (updateReportStatus.fulfilled.match(reponse)) {
        toast.success("Updated status!");
      }
    } catch (error: any) {
      toast.error(`${error.message || "Failed to update status!"}`);
    }
  };

  useEffect(() => {
    updateStatus();
  }, [status]);

  const getColorByStatus = () => {
    switch (status) {
      case ReportStatus.PENDING:
        return "border-2 border-orange-500";

      case ReportStatus.REJECTED:
        return "border-2 border-red-500";

      case ReportStatus.RESOLVED:
        return "border-2 border-green-500";

      default:
        break;
    }
  };

  return (
    <Card className="w-full h-max flex flex-col justify-center items-start gap-5">
      <CardTitle className="text-2xl font-bold w-full px-5 pt-5">
        {report.reportTitle}
      </CardTitle>
      <CardContent className="w-full h-full">
        <div className="w-full flex items-center gap-5">
          <div className="w-full flex flex-col justify-center items-start gap-5">
            <CardDescription className="w-full h-max text-lg font-normal text-black dark:text-white bg-[#353535] rounded-md p-2">
              {report.report.length > 255 && !expanded ? (
                <>{report.report.slice(0, 500)}</>
              ) : (
                report.report
              )}
            </CardDescription>
            <div className="w-full flex justify-beween items-center gap-5">
              <div className="w-full flex justify-start items-center gap-5">
                <div className="min-w-max rounded-md bg-slate-500 p-2 flex justify-center items-center gap-2">
                  <Calendar />
                  Date: {moment(report.createdAt).format("YYYY-MM-DD")}
                </div>
                {report.mediaType === ReportMediaType.IMAGE ? (
                  <div
                    className="min-w-max rounded-md bg-slate-500 p-2 flex justify-center items-center gap-2 cursor-pointer"
                    onClick={() =>
                      openReportMedia(report.media, report.mediaType)
                    }
                  >
                    <ImageIcon /> Image Attachment
                  </div>
                ) : (
                  <div
                    className="min-w-max rounded-md bg-slate-500 p-2 flex justify-center items-center gap-2 cursor-pointer"
                    onClick={() =>
                      openReportMedia(report.media, report.mediaType)
                    }
                  >
                    <VideoIcon /> Video Attachment
                  </div>
                )}
                <ReportStatusFilter
                  status={status}
                  allRequired={false}
                  setStatus={setStatus}
                  className={`${getColorByStatus()} w-max rounded-md  p-2 py-5 flex justify-center items-center gap-2 text-white`}
                />
                <ReporterIndicator user={user} />
              </div>
              <div className="w-full flex justify-end items-center">
                {expanded ? (
                  <button
                    className="bg-white text-blue-500 rounded-md p-2 flex justify-center items-center gap-1"
                    onClick={() => setExpanded(false)}
                  >
                    <ChevronUp />
                    Collapse
                  </button>
                ) : (
                  <button
                    className="bg-white text-blue-500 rounded-md p-2 flex justify-center items-center gap-1"
                    onClick={() => setExpanded(true)}
                  >
                    <ChevronDown />
                    Read More
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportTile;
