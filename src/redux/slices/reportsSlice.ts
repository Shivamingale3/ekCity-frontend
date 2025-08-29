import type { GetReportsByFilter, Report } from "@/types/report.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { reportsInitialState } from "../states/reportsStates";
import { getReportsByFilter } from "../thunks/reportsThunk";

const postsSlice = createSlice({
  name: "reports",
  initialState: reportsInitialState,
  reducers: {
    // clearError: (state) => {
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    // Fetch Posts
    builder
      .addCase(getReportsByFilter.pending, (state) => {
        state.getReportsLoading = true;
        state.getReportsError = null;
      })
      .addCase(
        getReportsByFilter.fulfilled,
        (state, action: PayloadAction<GetReportsByFilter>) => {
          const data: Report[] = action.payload.data;
          state.reports = data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          state.getReportsLoading = false;
          state.getReportsError = null;
        }
      )
      .addCase(getReportsByFilter.rejected, (state, action) => {
        state.getReportsLoading = false;
        state.getReportsError =
          action.error.message || "Failed to get reports!";
      });
  },
});

export const {} = postsSlice.actions;
export default postsSlice.reducer;
