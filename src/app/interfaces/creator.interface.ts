export interface Creator {
    uid: string;
    username: string;
    password?: string;
    characters: {
      [characterId: string]: {
        name: string;
        owned: boolean;
        image: string;
        cons: number;    // 0-6
      }
    };
    socialLinks?: {
      youtube?: string;
      twitch?: string;
    };
  }
  
  export interface Character {
    id: string;
    name: string;
    element: string;
    rarity: number;
    image: string;
    weaponType: string;
  }
  
  export interface TeamRequest {
    id: string;
    creatorId: string;
    selectedCharacters: string[];
    message: string;
    senderName: string;
    timestamp: Date;
    status: 'pending' | 'approved' | 'rejected';
  }