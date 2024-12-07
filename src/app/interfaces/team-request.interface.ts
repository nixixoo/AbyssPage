export interface TeamRequest {
  id?: string;
  fromUserId: string | null;
  fromUsername?: string;
  toUserId: string;
  characters: string[];
  message?: string;
  isAnonymous: boolean;
} 