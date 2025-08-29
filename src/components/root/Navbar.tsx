import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/types/authTypes";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import LanguageSwitcher from "./LanguageSwitcher";
import ProfileMenu from "./ProfileMenu";
import { ThemeToggle } from "./ThemeToggle";

function Navbar() {
  const { isDark } = useTheme();
  const dark = "/logo_dark.png";
  const light = "/logo_light.png";
  const [image, setImage] = useState<string>(light);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Fix: Use useRouterState to get current location
  const routerState = useRouterState();
  const isProfile = routerState.location.pathname === "/profile";

  useEffect(() => {
    setImage(isDark ? dark : light);
  }, [isDark]);

  return (
    <div className="w-full h-[8vh] sm:h-[9vh] lg:h-[10vh] min-h-[50px] sm:min-h-[60px] bg-light-bg-primary border-b border-input drop-shadow-lg px-3 sm:px-6 lg:px-10 flex justify-between items-center text-light-text-primary">
      {/* Logo Section */}
      <div className="flex items-center gap-2 w-max h-max flex-shrink-0">
        {isProfile && (
          <button
            className="flex items-center justify-center rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            style={{ height: 32, width: 32 }}
            onClick={() => navigate({ to: "/feed" })}
            aria-label="Back to feed"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <img
          onClick={() => navigate({ to: "/feed" })}
          src={image}
          alt="ek-City logo"
          className="h-6 w-12 sm:h-16 sm:w-32 md:h-10 md:w-20 lg:h-12 lg:w-24 xl:h-[70px] xl:w-[135px] object-contain cursor-pointer"
        />
      </div>

      {/* Actions Section */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
        {user && user.role === UserRole.CITIZEN && (
          <button
            className="rounded-full border border-red-500 p-2 "
            onClick={() => navigate({ to: "/report" })}
          >
            <ShieldAlert className="text-red-500" />
          </button>
        )}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
        <ThemeToggle />
        {user && <ProfileMenu />}
      </div>
    </div>
  );
}

export default Navbar;
