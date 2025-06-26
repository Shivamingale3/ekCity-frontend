import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { getInitials } from "@/utils/universalFunctions";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function ProfileMenu() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleViewProfile = () => {
    navigate({ to: "/profile", replace: true });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <Avatar>
                <AvatarImage
                  src={user.profilePicture ?? ""}
                  alt="profile"
                  className="bg-white border border-gray-300 dark:bg-white"
                />
                <AvatarFallback className="text-xs bg-black dark:bg-white text-white dark:text-black">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center space-x-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profilePicture ?? ""} alt="profile" />
                <AvatarFallback className="text-xs bg-black dark:bg-white text-white dark:text-black">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewProfile}>
              <User className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

export default ProfileMenu;
