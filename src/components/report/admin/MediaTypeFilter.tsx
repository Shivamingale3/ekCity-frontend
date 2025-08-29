import { ReportMediaType } from "@/types/report.types";
import type { Dispatch, SetStateAction } from "react";

const MediaTypeFilter = ({
  mediaType,
  setMediaType,
}: {
  mediaType: ReportMediaType | null;
  setMediaType: Dispatch<SetStateAction<ReportMediaType | null>>;
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <span className="text-white">Media type:</span>
      <button
        className={`${
          mediaType === ReportMediaType.IMAGE
            ? "bg-white text-black hover:bg-white hover:opacity-90 border"
            : "border text-white hover:bg-white hover:opacity-50 hover:text-black"
        } p-3 rounded-md `}
        onClick={() => {
          if (mediaType === ReportMediaType.IMAGE) {
            setMediaType(null);
          } else {
            setMediaType(ReportMediaType.IMAGE);
          }
        }}
      >
        Image
      </button>
      <button
        className={`${
          mediaType === ReportMediaType.VIDEO
            ? "bg-white text-black hover:bg-white hover:opacity-90 border"
            : "border text-white hover:bg-white hover:opacity-50 hover:text-black"
        } p-3 rounded-md `}
        onClick={() => {
          if (mediaType === ReportMediaType.VIDEO) {
            setMediaType(null);
          } else {
            setMediaType(ReportMediaType.VIDEO);
          }
        }}
      >
        Video
      </button>
    </div>
  );
};

export default MediaTypeFilter;
