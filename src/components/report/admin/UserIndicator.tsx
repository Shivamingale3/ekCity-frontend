import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/authTypes";

const UserIndicator = ({ user }: { user: User | null }) => {
  return (
    <>
      {user && (
        <div className="min-w-max h-[140px] border rounded-lg bg-black flex justify-start items-start p-5 gap-5">
          <Avatar className="w-[100px] h-[100px] text-primary text-3xl">
            <AvatarImage src={user.profilePicture || ""} />
            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center items-start text-white text-md h-full">
            <span className="font-semibold flex justify-start items-center gap-1">
              Name: <p className="font-normal">{user.fullName}</p>
            </span>
            <span className="font-semibold flex justify-start items-center gap-1">
              Email: <p className="font-normal">{user.email}</p>
            </span>
            <span className="font-semibold flex justify-start items-center gap-1">
              Mobile: <p className="font-normal">{user.mobile}</p>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default UserIndicator;
