import { type Dispatch, type SetStateAction } from "react";
import { Input } from "../ui/input";

const ReportTitle = ({
  reportTitle,
  setReportTitle,
}: {
  reportTitle: string;
  setReportTitle: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Input
      className="h-14"
      value={reportTitle}
      onChange={(e) => setReportTitle(e.target.value)}
      placeholder="Report Title"
    />
  );
};

export default ReportTitle;
