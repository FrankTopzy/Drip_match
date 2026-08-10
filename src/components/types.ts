import type { ReactNode } from "react"

export type DripmatchContextPropType = {
  children: ReactNode
}

export interface SavedResult {
  id: string;
  resultImageUrl: string;
  originalPhotoUrl: string;
  garmentName: string;
  garmentCategory: string;
  garmentPrice: string;
  garmentImageUrl: string;
  savedAt: number; // timestamp
}