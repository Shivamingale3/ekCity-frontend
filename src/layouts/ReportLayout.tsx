import ReportMobileParent from "@/components/report/ReportMobileParent";
import ReportWebParent from "@/components/report/ReportWebParent";

function ReportLayout() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return <>{isMobile ? <ReportMobileParent /> : <ReportWebParent />}</>;
}

export default ReportLayout;
