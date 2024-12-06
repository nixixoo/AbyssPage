export interface Creator {
    uid: string;
    username: string;
    avatar?: string;
    characters: { [key: string]: boolean };
    constellations: { [key: string]: number };
    socialLinks: { [key: string]: string };
}
  
  