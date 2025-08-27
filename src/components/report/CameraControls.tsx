import { Camera, SwitchCamera, Video } from "lucide-react";

function CameraControls({
  startRecording,
  stopRecording,
  capturePhoto,
  switchCamera,
  capturing,
}: {
  startRecording: () => void;
  stopRecording: () => void;
  capturePhoto: () => void;
  switchCamera: () => void;
  capturing: boolean;
}) {
  return (
    <div className="w-full h-full border border-input rounded-md">
      <div className="w-full h-full flex justify-around items-center">
        <button className="p-5 border rounded-full" onClick={capturePhoto}>
          <Camera />
        </button>
        {capturing ? (
          <button className="p-5 border rounded-full" onClick={stopRecording}>
            <Video className="text-red-500" />
          </button>
        ) : (
          <button className="p-5 border rounded-full" onClick={startRecording}>
            <Video />
          </button>
        )}
        <button className="p-5 border rounded-full" onClick={switchCamera}>
          <SwitchCamera />
        </button>
      </div>
    </div>
  );
}

export default CameraControls;
