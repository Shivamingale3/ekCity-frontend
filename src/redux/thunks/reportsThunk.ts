import { apiService } from "@/services/apiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createReport = createAsyncThunk<
  {},
  {
    anonymous: "yes" | "no";
    report: string;
    file: {
      file: Blob;
      type: "img" | "video";
    };
    reportTo: string;
  }
>("reports/create", async ({ anonymous, file, report, reportTo }) => {
  try {
    let formData = new FormData();
    formData.append(
      "media",
      file.file,
      file.type === "img" ? "reportPhoto.png" : "reportVideo.webm"
    );
    formData.append("report", report);
    formData.append("reportTo", reportTo);
    const response = await apiService.post("/reports/", formData, {
      params: {
        anonymous,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to create report");
  } catch (error) {
    throw error;
  }
});

// export const getPostComments = createAsyncThunk<
//   GetPostCommentResponse,
//   { postId: string; params?: { page?: number; limit?: number } }
// >("posts/getPostComments", async ({ postId, params }, { rejectWithValue }) => {
//   try {
//     const response = await apiService.get<GetPostCommentResponse>(
//       `/comments/${postId}`,
//       { params }
//     );
//     return response.data;
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });
