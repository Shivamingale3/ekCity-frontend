import { apiService } from "./apiService";

export async function uploadMediaToCloudinary({
  file,
  uploadType,
  resourceType = "auto",
  publicId,
  eager,
  chunkSize,
  onProgress,
}: {
  file: File;
  uploadType: "PROFILE" | "POSTIMAGE" | "POSTVIDEO";
  resourceType?: "image" | "video" | "auto";
  publicId?: string;
  eager?: string;
  chunkSize?: number;
  onProgress?: (percent: number) => void;
}): Promise<string> {
  const presignRes = await apiService.post<any>(
    "/users/media/presign",
    { uploadType, resourceType, publicId, eager, chunkSize },
    { withCredentials: true }
  );
  console.log(onProgress);

  const { uploadUrl, params } = presignRes.data.data; // Note: using 'params' instead of 'fields'
  if (!uploadUrl) throw new Error("No upload URL received from backend");

  const formData = new FormData();

  // Add all signed parameters from backend
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  formData.append("file", file);

  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Failed to upload file to Cloudinary: ${errorText}`);
  }

  const uploadResult = await uploadRes.json();
  return uploadResult.secure_url;
}
