import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getBodiesToCollab } from "@/redux/thunks/feedThunk";
import { UserRole, type User } from "@/types/authTypes";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

function SelectAuthority({
  reportTo,
  setReportTo,
}: {
  reportTo: string;
  setReportTo: Dispatch<SetStateAction<string>>;
}) {
  const dispatch = useAppDispatch();
  const { usersToCollab } = useAppSelector((state) => state.feed);
  const [govtBodies, setGovtBodies] = useState<User[]>([]);
  useEffect(() => {
    dispatch(getBodiesToCollab(null));
  }, []);

  useEffect(() => {
    setGovtBodies(
      usersToCollab.filter((user) => user.role === UserRole.GOVERNMENT)
    );
  }, [usersToCollab]);

  useEffect(() => {
    if (govtBodies.length > 0) {
      setReportTo(
        govtBodies.find((user) => user?.fullName.includes("Police"))?.id ??
          "Select Authority"
      );
    }
  }, [govtBodies]);
  return (
    <>
      {govtBodies.length > 0 && (
        <div className="w-full flex flex-col gap-2">
          <span className="text-[#707070] font-semibold">
            Select Authority to report:
          </span>
          <Select
            value={reportTo}
            onValueChange={(value) => setReportTo(value)}
          >
            <SelectTrigger className=" h-10">
              {govtBodies.find((body) => body.id === reportTo)?.fullName ??
                "Select Authority"}
            </SelectTrigger>
            <SelectContent>
              {govtBodies.map((user) => (
                <SelectItem key={user?.id} value={user?.id}>
                  {user?.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}

export default SelectAuthority;
