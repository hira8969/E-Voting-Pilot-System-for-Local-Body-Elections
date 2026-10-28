export interface Party {
  id: string;
  name: string;
  code: string;
  symbol: string;
  symbolName: string;
  flagUrl?: string;
  presidentName: string;
  headquarters: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber: string;
  candidateCount: number;
  manifestoFile?: {
    name: string;
    size: string;
    uploadedAt: string;
    url: string;
  };
  manifestoKeyPoints: string[];
}
