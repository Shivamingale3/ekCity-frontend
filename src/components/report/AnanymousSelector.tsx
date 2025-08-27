import { type Dispatch, type SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function AnonymousSelector({
  isAnonymous,
  setIsAnonymous,
}: {
  isAnonymous: string;
  setIsAnonymous: Dispatch<SetStateAction<"yes" | "no">>;
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-[#707070] font-semibold">
        Report as Anonymous user?
      </span>
      <Select
        value={isAnonymous}
        onValueChange={(val) => setIsAnonymous(val as "yes" | "no")}
      >
        <SelectTrigger className="h-10">
          <SelectValue /> {/* 👈 this will auto-show current value */}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default AnonymousSelector;
