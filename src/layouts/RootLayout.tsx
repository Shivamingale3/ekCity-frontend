import Navbar from "@/components/root/Navbar";
import { Outlet, useLocation } from "@tanstack/react-router";

function RootLayout() {
  const pathName = useLocation().pathname;
  const navbarNotRequiredPaths = ["/profile"];
  return (
    <div className="h-screen w-screen flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary">
      {navbarNotRequiredPaths.includes(pathName) || <div className="w-full flex-shrink-0 sticky top-0">
        <Navbar />
      </div>}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
