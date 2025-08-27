import type { Dispatch, SetStateAction } from "react";
import { Textarea } from "../ui/textarea";

const ReportDescription = ({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Textarea
      className="w-full h-full"
      placeholder="Explain the issue..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    ></Textarea>
  );
};

export default ReportDescription;
