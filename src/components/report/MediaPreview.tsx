import { Button } from "../ui/button";

function MediaPreview({
  image,
  video,
  onClear,
}: {
  image: string;
  video: string;
  onClear: () => void;
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
      </div>
    </div>
  );
}

export default MediaPreview;
