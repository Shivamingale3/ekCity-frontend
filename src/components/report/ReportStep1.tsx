import { Camera, SwitchCamera, Video } from "lucide-react";
import Webcam from "react-webcam";

function ReportStep1({
  webcamRef,
  videoConstraints,
  switchCamera,
  capturePhoto,
  startRecording,
  stopRecording,
  capturing,
}: //   previewImage,
//   previewVideo,
//   open,
//   setOpen,
{
  webcamRef: React.RefObject<Webcam | null>;
  videoConstraints: {
    facingMode: "user" | "environment";
    width: {
      ideal: number;
    };
    height: {
      ideal: number;
    };
  };
  switchCamera: () => void;
  capturePhoto: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  capturing: boolean;
  //   previewImage: string[];
  //   previewVideo: string[];
  //   open: boolean;
  //   setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-start items-start overflow-y-auto">
      <div className="w-full h-full p-2 flex flex-col justify-start items-center border gap-5">
        <div className="w-[95%] h-[80%] border border-input rounded-md">
          <Webcam
            ref={webcamRef}
            audio={true}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
        <div className="w-full flex justify-around items-center px-10 h-full">
          <button
            onClick={switchCamera}
            className="h-10 w-10 flex justify-center items-center rounded-full border"
            title="Switch to other camera"
          >
            <SwitchCamera />
          </button>
          <button
            className="h-10 w-10 flex justify-center items-center rounded-full border"
            title="Capture photo"
            onClick={capturePhoto}
          >
            <Camera />
          </button>
          {capturing ? (
            <button
              title="Stop recording"
              className="h-10 w-10 flex justify-center items-center rounded-full border"
              onClick={() => {
                stopRecording();
              }}
            >
              <Video className="text-red-500" />
            </button>
          ) : (
            <button
              title="Start Recording"
              onClick={startRecording}
              className="h-10 w-10 flex justify-center items-center rounded-full border"
            >
              <Video />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportStep1;
