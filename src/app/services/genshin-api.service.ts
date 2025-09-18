import { Injectable } from '@angular/core';
import { Character } from '../constants/character-list';

interface GenshinAPICharacter {
  name: string;
  elementText: string;
  rarity: number;
  weaponText: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenshinApiService {

  private readonly API_BASE_URL = 'https://genshin-db-api.vercel.app/api/v5';

  async getCharacterData(characterName: string): Promise<GenshinAPICharacter | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/characters?query=${characterName}`);
      const data = await response.json();
      
      if (data && data.name) {
        return {
          name: data.name,
          elementText: data.elementText,
          rarity: data.rarity,
          weaponText: data.weaponText
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching data for ${characterName}:`, error);
      return null;
    }
  }

  async updateCharacterWithAPIData(character: Character): Promise<Character> {
    const apiData = await this.getCharacterData(character.name);
    
    if (apiData) {
      return {
        ...character,
        name: apiData.name,
        element: apiData.elementText,
        rarity: apiData.rarity,
        weaponType: apiData.weaponText
      };
    }
    
    return character;
  }
}