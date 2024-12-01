export interface Creator {
    uid: string;
    username: string;
    characters: { [key: string]: boolean };
    password?: string;
    socialLinks?: {
      youtube?: string;
    };
  }
  
  