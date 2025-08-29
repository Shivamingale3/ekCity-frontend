import { useAppDispatch } from "@/redux/store";
import { createReport } from "@/redux/thunks/reportsThunk";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type Webcam from "react-webcam";
import { toast } from "sonner";
import ReportStep2 from "./MediaViewer";
import ReportStep1 from "./ReportStep1";
import ReportStep3 from "./ReportStep3";

function ReportMobileParent() {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 720 },
    height: { ideal: 1280 },
  };

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

  useEffect(() => {
    if (previewImage || previewVideo) {
      setCurrentStep(2);
    }
  }, [previewImage, previewVideo]);

  const onClear = () => {
    setPreviewImage("");
    setPreviewVideo("");
    setCurrentStep(1);
  };

  const onProceed = () => {
    setCurrentStep(3);
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
        setCurrentStep(1);
      }
    } catch (error) {
      toast.error("Failed to submit report! Please try again!");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      {submitting ? (
        <div className="w-full h-full flex justify-center items-center">
          <span className="w-full flex flex-col justify-center items-center gap-5">
            <Loader className="animate-spin" />
            Submitting, please wait!
          </span>
        </div>
      ) : currentStep === 1 ? (
        <ReportStep1
          switchCamera={switchCamera}
          webcamRef={webcamRef}
          videoConstraints={videoConstraints}
          capturePhoto={capturePhoto}
          startRecording={startRecording}
          stopRecording={stopRecording}
          capturing={capturing}
        />
      ) : currentStep === 2 ? (
        <ReportStep2
          image={previewImage}
          video={previewVideo}
          onClear={onClear}
          onProceed={onProceed}
        />
      ) : currentStep === 3 ? (
        <ReportStep3
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          reportDetails={report}
          setReportDetails={setReport}
          onClickSubmitReport={onClickSubmitReport}
          reportTo={reportTo}
          setReportTo={setReportTo}
          reportTitle={reportTitle}
          setReportTitle={setReportTitle}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default ReportMobileParent;
