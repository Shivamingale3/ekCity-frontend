import type Webcam from "react-webcam";
import CameraControls from "./CameraControls";
import CameraScreen from "./CameraScreen";

const WebCameraScreen = ({
  webcamRef,
  videoConstraints,
  startRecording,
  stopRecording,
  capturePhoto,
  switchCamera,
  capturing,
}: {
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
  startRecording: () => void;
  stopRecording: () => void;
  capturePhoto: () => void;
  switchCamera: () => void;
  capturing: boolean;
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <CameraScreen webcamRef={webcamRef} videoConstraints={videoConstraints} />
      <CameraControls
        startRecording={startRecording}
        stopRecording={stopRecording}
        capturePhoto={capturePhoto}
        switchCamera={switchCamera}
        capturing={capturing}
      />
    </div>
  );
};

export default WebCameraScreen;
