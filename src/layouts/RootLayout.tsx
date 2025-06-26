import Navbar from "@/components/root/Navbar";
import { Outlet } from "@tanstack/react-router";

function RootLayout() {
  return (
    <div className="h-screen w-screen flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="w-full flex-shrink-0 sticky top-0">
        <Navbar />
      </div>
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
