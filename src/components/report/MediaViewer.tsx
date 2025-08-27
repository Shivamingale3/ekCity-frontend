import { Button } from "../ui/button";

function ReportStep2({
  image,
  video,
  onClear,
  onProceed,
}: {
  image: string;
  video: string;
  onClear: () => void;
  onProceed: () => void;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-5 gap-5">
      {image && (
        <img
          src={image}
          alt="preview-image"
          className="object-contain w-full h-full border"
        />
      )}
      {video && (
        <video
          src={video}
          autoPlay={true}
          className="object-contain w-full h-full border"
        />
      )}

      <div className="w-full flex justify-around items-center">
        <Button onClick={onClear}>Re-Capture</Button>
        <Button onClick={onProceed}>Proceed</Button>
      </div>
    </div>
  );
}

export default ReportStep2;
