// CameraCapture.tsx
import { Camera, Save, SwitchCamera, Video } from "lucide-react";
import { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function ReportCamera() {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const videoConstraints = isMobile
    ? {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      }
    : {
        facingMode: facingMode,
        width: { ideal: 720 },
        height: { ideal: 1280 },
      };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };
  // 📸 Capture Photo
  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreviewImage(imageSrc);
      // Send to backend
      uploadFile(imageSrc, "photo");
    }
  };

  // 🎥 Start Recording
  const startRecording = () => {
    setCapturing(true);
    const stream = webcamRef.current?.stream as MediaStream;
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.start();
  };

  // ⏹️ Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setCapturing(false);
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  // ✅ Save/Preview Video
  const saveVideo = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setPreviewVideo(url);
      setRecordedChunks([]);
      // Send to backend
      uploadFile(blob, "video");
    }
  };

  // 🌐 Upload function (example)
  const uploadFile = async (file: string | Blob, type: "photo" | "video") => {
    let formData = new FormData();
    if (type === "photo" && typeof file === "string") {
      // convert base64 -> Blob
      const res = await fetch(file);
      const blob = await res.blob();
      formData.append("file", blob, "photo.png");
    } else if (type === "video" && file instanceof Blob) {
      formData.append("file", file, "video.webm");
    }

    await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-5">
      <div className="w-full max-w-[1920px] mx-auto border border-input rounded-md">
        <div className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[18/9]">
          <Webcam
            ref={webcamRef}
            audio={true}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            className="w-full h-full object-fill rounded-xl"
          />
        </div>
      </div>

      {/* Custom Buttons */}
      <div className="flex gap-2">
        <button
          onClick={capturePhoto}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          <Camera />
        </button>
        {capturing ? (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            <Video className="text-red-500" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            <Video />
          </button>
        )}
        <button
          onClick={saveVideo}
          disabled={!recordedChunks.length}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          <Save />
        </button>
        <button
          onClick={switchCamera}
          disabled={!recordedChunks.length}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          <SwitchCamera />
        </button>
      </div>

      {/* Preview Section */}
      {previewImage && (
        <div>
          <h3>Captured Photo:</h3>
          <img
            src={previewImage}
            alt="Captured"
            className="rounded-lg border"
          />
        </div>
      )}
      {previewVideo && (
        <div>
          <h3>Recorded Video:</h3>
          <video src={previewVideo} controls className="rounded-lg border" />
        </div>
      )}
    </div>
  );
}
