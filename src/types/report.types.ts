export type GetReportsByFilter = {
  status: string;
  message: string;
  data: Report[];
};

export type Report = {
  id: string;
  reportTitle: string;
  report: string;
  media: string;
  mediaType: ReportMediaType;
  userId: string | null;
  reportTo: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
};

export enum ReportStatus {
  PENDING = "pending",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

export enum ReportMediaType {
  IMAGE = "img",
  VIDEO = "video",
}

export type SearchFilterQuery = {
  mediaType?: ReportMediaType;
  userId?: string;
  reportTitle?: string;
  reportTo?: string;
  status?: ReportStatus;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
};
