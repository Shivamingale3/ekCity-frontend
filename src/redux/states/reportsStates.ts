import type { Report } from "@/types/report.types";

export interface ReportsState {
  reports: Report[];
  getReportsLoading: boolean;
  getReportsError: string | null;
}

export const reportsInitialState: ReportsState = {
  reports: [],
  getReportsLoading: false,
  getReportsError: null,
};
