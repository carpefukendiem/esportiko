export interface TeamRosterRow {
  id: string;
  playerName: string;
  number: string;
  size: string;
  quantity: number;
  notes?: string;
}

export interface UploadedAssetMeta {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  storagePath?: string;
}

export interface LeadSourceMeta {
  sourcePage: string;
  formType: "team-order" | "business-order" | "contact";
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage?: string;
  submissionTimestamp: string;
}

export interface TeamOrderLead extends LeadSourceMeta {
  orderType: "team";
  teamName: string;
  sport: string;
  season: string;
  contactName: string;
  role: "coach" | "manager" | "parent" | "admin" | "other";
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "text";
  dueDate?: string;
  apparelItems: string[];
  decorationType: string;
  estimatedPlayers: number;
  needsNamesNumbers: boolean;
  needsGarmentSourcing: boolean;
  rosterReady: boolean;
  roster?: TeamRosterRow[];
  notes?: string;
  uploadedAssets?: UploadedAssetMeta[];
}

export interface BusinessOrderLead extends LeadSourceMeta {
  orderType: "business";
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  projectType: string;
  garmentsNeeded: string;
  decorationType: string;
  estimatedQuantity: number;
  deadline?: string;
  projectDescription?: string;
  placementNotes?: string;
  preferredContact: "email" | "phone" | "text";
  isRepeatOrder?: boolean;
  needsGarmentSourcing?: boolean;
  notes?: string;
  uploadedAssets?: UploadedAssetMeta[];
}

export interface ContactLead extends LeadSourceMeta {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  serviceInterest?: string;
}
