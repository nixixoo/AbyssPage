export interface Creator {
    uid: string;
    username: string;
    characters: { [key: string]: boolean };
    constellations: { [key: string]: number };
    socialLinks: { [key: string]: string };
}
  
  