import AnonymousSelector from "@/components/report/AnanymousSelector";
import ReportDescription from "@/components/report/ReportDescription";
import SelectAuthority from "@/components/report/SelectAuthority";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/store";
import { createReport } from "@/redux/thunks/reportsThunk";
import { Loader } from "lucide-react";
import { useRef, useState } from "react";
import type Webcam from "react-webcam";
import { toast } from "sonner";
import MediaPreview from "./MediaPreview";
import ReportTitle from "./ReportTitle";
import WebCameraScreen from "./WebCameraScreen";

function ReportWebParent() {
  const dispatch = useAppDispatch();
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewVideo, setPreviewVideo] = useState<string>("");
  const [report, setReport] = useState<string>("");
  const [capturedFile, setCapturedFile] = useState<{
    file: Blob;
    type: "img" | "video";
  } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<"yes" | "no">("no");
  const [reportTo, setReportTo] = useState<string>("");
  const [reportTitle, setReportTitle] = useState<string>("");
  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  const startRecording = () => {
    setCapturing(true);
    const stream = webcamRef.current?.stream as MediaStream;

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = recorder;

    const chunks: Blob[] = [];

    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      if (chunks.length) {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setPreviewVideo(url);
        setCapturedFile({ file: blob, type: "video" }); // ✅ fix here
      }
    };

    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
    setCapturing(false);
  };

  // 📸 Capture Photo
  const capturePhoto = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreviewImage(imageSrc);
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      setCapturedFile({ file: blob, type: "img" });
    }
  };

  // 🔄 Switch Camera
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const onClickSubmitReport = async () => {
    setSubmitting(true);
    if (!capturedFile) {
      toast.error("Nothing captured to report!");
      setSubmitting(false);
      return;
    }

    if (!report || report.length === 0) {
      toast("Explain report!");
      setSubmitting(false);
      return;
    }
    try {
      const response = await dispatch(
        createReport({
          anonymous: isAnonymous,
          file: capturedFile,
          reportTitle,
          report,
          reportTo,
        })
      );

      if (response.type === "reports/create/fulfilled") {
        toast.success("Report submitted successfully!");
        setPreviewImage("");
        setPreviewVideo("");
        setReport("");
        setReportTitle("");
        setCapturedFile(null);
        setSubmitting(false);
      }
    } catch (error) {
      toast.error("Failed to submit report! Please try again!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-start items-center">
      <div className="border border-input w-[30%] h-full p-5 flex flex-col justify-start items-center gap-5">
        <p className="text-lg font-bold text-black dark:text-white">
          Please fill the following details
        </p>
        <AnonymousSelector
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />
        <SelectAuthority reportTo={reportTo} setReportTo={setReportTo} />
        <ReportTitle
          reportTitle={reportTitle}
          setReportTitle={setReportTitle}
        />
        <ReportDescription value={report} setValue={setReport} />
        <div className="w-full flex justify-around items-center">
          <Button onClick={() => setReport("")} disabled={report.length === 0}>
            Clear
          </Button>
          <Button
            onClick={onClickSubmitReport}
            disabled={
              report.length === 0 ||
              !capturedFile?.file ||
              reportTo === "" ||
              reportTitle === ""
            }
          >
            {submitting ? (
              <>
                <Loader className="animate-spin" /> Submitting ...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
      <section className="w-full h-full flex flex-col justify-center items-start p-2 gap-2">
        {previewImage || previewVideo ? (
          <MediaPreview
            image={previewImage}
            video={previewVideo}
            onClear={() => {
              setPreviewImage(""), setPreviewVideo("");
            }}
          />
        ) : (
          <WebCameraScreen
            capturePhoto={capturePhoto}
            startRecording={startRecording}
            stopRecording={stopRecording}
            switchCamera={switchCamera}
            webcamRef={webcamRef}
            videoConstraints={videoConstraints}
            capturing={capturing}
          />
        )}
      </section>
    </div>
  );
}

export default ReportWebParent;
