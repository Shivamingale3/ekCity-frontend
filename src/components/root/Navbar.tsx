import { useTheme } from "../../hooks/useTheme";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import ProfileMenu from "./ProfileMenu";
import { useAuthStore } from "@/stores/authStore";

function Navbar() {
  const { isDark } = useTheme();
  const dark = "/logo_dark.png";
  const light = "/logo_light.png";
  const [image, setImage] = useState<string>(light);
  const { user } = useAuthStore();

  useEffect(() => {
    setImage(isDark ? dark : light);
  }, [isDark]);

  return (
    <div className="w-full h-[8vh] sm:h-[9vh] lg:h-[10vh] min-h-[50px] sm:min-h-[60px] bg-light-bg-primary border-b border-gray-300 dark:border-gray-800 drop-shadow-lg px-3 sm:px-6 lg:px-10 flex justify-between items-center text-light-text-primary">
      {/* Logo Section */}
      <div className="flex justify-center items-center w-max h-max flex-shrink-0">
        <img
          src={image}
          alt="ek-City logo"
          className="h-6 w-12 sm:h-16 sm:w-32 md:h-10 md:w-20 lg:h-12 lg:w-24 xl:h-[70px] xl:w-[135px] object-contain"
        />
      </div>

      {/* Actions Section */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
        {/* Hide language switcher on very small screens */}
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
