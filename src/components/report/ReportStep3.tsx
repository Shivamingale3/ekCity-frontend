import type { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import AnonymousSelector from "./AnanymousSelector";
import ReportDescription from "./ReportDescription";
import SelectAuthority from "./SelectAuthority";

function ReportStep3({
  reportDetails,
  setReportDetails,
  onClickSubmitReport,
  isAnonymous,
  setIsAnonymous,
  reportTo,
  setReportTo,
}: {
  reportDetails: string;
  setReportDetails: Dispatch<SetStateAction<string>>;
  onClickSubmitReport: () => void;
  isAnonymous: string;
  setIsAnonymous: Dispatch<SetStateAction<"yes" | "no">>;
  reportTo: string;
  setReportTo: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="border border-input w-full h-full p-5 flex flex-col justify-start items-center gap-5">
      <p className="text-lg font-bold text-black dark:text-white">
        Please fill the following details
      </p>
      <AnonymousSelector
        isAnonymous={isAnonymous}
        setIsAnonymous={setIsAnonymous}
      />
      <SelectAuthority reportTo={reportTo} setReportTo={setReportTo} />
      <ReportDescription value={reportDetails} setValue={setReportDetails} />
      <div className="w-full flex justify-around items-center">
        <Button
          onClick={() => setReportDetails("")}
          disabled={reportDetails.length === 0}
        >
          Clear
        </Button>
        <Button
          onClick={onClickSubmitReport}
          disabled={reportDetails.length === 0 || reportTo === ""}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default ReportStep3;
