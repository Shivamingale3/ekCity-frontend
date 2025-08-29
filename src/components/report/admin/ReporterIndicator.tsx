import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { User } from "@/types/authTypes";
import { UserLock } from "lucide-react";
import { IoPerson } from "react-icons/io5";
import UserIndicator from "./UserIndicator";

const ReporterIndicator = ({ user }: { user: User | null }) => {
  return (
    <div className="w-max h-max py-2 px-5 border flex rounded-md cursor-context-menu">
      {user ? (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <div className="flex justify-center items-center gap-2">
                <IoPerson />
                {user.fullName}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-transparent">
              <UserIndicator user={user} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex justify-center items-center gap-2">
          <UserLock />
          Anonymous
        </div>
      )}
    </div>
  );
};

export default ReporterIndicator;
