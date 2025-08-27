import Webcam from "react-webcam";

const CameraScreen = ({
  webcamRef,
  videoConstraints,
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
}) => {
  return (
    <div className="w-full max-w-[1920px] mx-auto border border-input rounded-md">
      <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[18/9]">
        <Webcam
          ref={webcamRef}
          audio={true}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          className="w-full h-full object-fill rounded-xl"
        />
      </div>
    </div>
  );
};

export default CameraScreen;
