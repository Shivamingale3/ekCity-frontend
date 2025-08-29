import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReportMediaType } from "@/types/report.types";

const ViewReportMedia = ({
  viewReportMedia,
  closeReportMedia,
}: {
  viewReportMedia: {
    open: boolean;
    media: string;
    mediaType: ReportMediaType;
  };
  closeReportMedia: () => void;
}) => {
  return (
    <Dialog open={viewReportMedia.open} onOpenChange={closeReportMedia}>
      <DialogContent className="w-[80%] h-[90%] flex flex-col justify-start items-center">
        <DialogTitle>Report Media</DialogTitle>
        {viewReportMedia.mediaType === ReportMediaType.IMAGE ? (
          <div className="w-full h-full flex justify-center items-center">
            <img
              src={viewReportMedia.media}
              alt="Report Image"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <video
              src={viewReportMedia.media}
              className="w-full h-full flex justify-center items-center"
              autoPlay
              loop
            ></video>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportMedia;
