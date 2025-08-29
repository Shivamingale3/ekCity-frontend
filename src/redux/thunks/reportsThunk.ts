import { apiService } from "@/services/apiService";
import type {
  GetReportsByFilter,
  ReportStatus,
  SearchFilterQuery,
} from "@/types/report.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createReport = createAsyncThunk<
  {},
  {
    anonymous: "yes" | "no";
    reportTitle: string;
    report: string;
    file: {
      file: Blob;
      type: "img" | "video";
    };
    reportTo: string;
  }
>(
  "reports/create",
  async (
    { anonymous, file, reportTitle, report, reportTo },
    { rejectWithValue }
  ) => {
    try {
      let formData = new FormData();
      formData.append(
        "media",
        file.file,
        file.type === "img" ? "reportPhoto.png" : "reportVideo.webm"
      );
      formData.append("reportTitle", reportTitle);
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
      return rejectWithValue(error);
    }
  }
);

export const getReportsByFilter = createAsyncThunk<
  GetReportsByFilter,
  { filter: SearchFilterQuery }
>("reports/get-by-filter", async ({ filter }, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetReportsByFilter>(
      `/reports/filter`,
      {
        params: filter,
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateReportStatus = createAsyncThunk<
  {},
  { reportId: string; status: ReportStatus }
>("reports/update", async ({ reportId, status }, { rejectWithValue }) => {
  try {
    const response = await apiService.patch(`/reports/${reportId}`, {
      status,
    });
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to update report status");
  } catch (error) {
    return rejectWithValue(error);
  }
});
