import { Injectable } from '@angular/core';
import { Character } from '../constants/character-list';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterCacheService {
  private characters: Character[] | null = null;
  private loadingPromise: Promise<Character[]> | null = null;
  private progressSubject = new BehaviorSubject<{current: number, total: number}>({current: 0, total: 0});
  
  public progress$ = this.progressSubject.asObservable();

  async getCharacters(): Promise<Character[]> {
    // Si ya tenemos los personajes, devolverlos inmediatamente
    if (this.characters) {
      return this.characters;
    }

    // Si ya estamos cargando, esperar esa promesa
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Iniciar nueva carga
    this.loadingPromise = this.loadCharactersFromAPI();
    
    try {
      this.characters = await this.loadingPromise;
      return this.characters;
    } finally {
      this.loadingPromise = null;
    }
  }

  private async loadCharactersFromAPI(): Promise<Character[]> {
    const baseList = [
      { id: 'aether', nameForAPI: 'Aether', nameForYatta: 'PlayerBoy' },
      { id: 'lumine', nameForAPI: 'Lumine', nameForYatta: 'PlayerGirl' },
      { id: 'albedo', nameForAPI: 'Albedo', nameForYatta: 'Albedo' },
      { id: 'alhaitham', nameForAPI: 'Alhaitham', nameForYatta: 'Alhatham' },
      { id: 'aloy', nameForAPI: 'Aloy', nameForYatta: 'Aloy' },
      { id: 'amber', nameForAPI: 'Amber', nameForYatta: 'Ambor' },
      { id: 'arataki_itto', nameForAPI: 'Arataki Itto', nameForYatta: 'Itto' },
      { id: 'arlecchino', nameForAPI: 'Arlecchino', nameForYatta: 'Arlecchino' },
      { id: 'baizhu', nameForAPI: 'Baizhu', nameForYatta: 'Baizhuer' },
      { id: 'barbara', nameForAPI: 'Barbara', nameForYatta: 'Barbara' },
      { id: 'beidou', nameForAPI: 'Beidou', nameForYatta: 'Beidou' },
      { id: 'bennett', nameForAPI: 'Bennett', nameForYatta: 'Bennett' },
      { id: 'candace', nameForAPI: 'Candace', nameForYatta: 'Candace' },
      { id: 'charlotte', nameForAPI: 'Charlotte', nameForYatta: 'Charlotte' },
      { id: 'chasca', nameForAPI: 'Chasca', nameForYatta: 'Chasca' },
      { id: 'chevreuse', nameForAPI: 'Chevreuse', nameForYatta: 'Chevreuse' },
      { id: 'chiori', nameForAPI: 'Chiori', nameForYatta: 'Chiori' },
      { id: 'chongyun', nameForAPI: 'Chongyun', nameForYatta: 'Chongyun' },
      { id: 'citlali', nameForAPI: 'Citlali', nameForYatta: 'Citlali' },
      { id: 'clorinde', nameForAPI: 'Clorinde', nameForYatta: 'Clorinde' },
      { id: 'collei', nameForAPI: 'Collei', nameForYatta: 'Collei' },
      { id: 'cyno', nameForAPI: 'Cyno', nameForYatta: 'Cyno' },
      { id: 'dehya', nameForAPI: 'Dehya', nameForYatta: 'Dehya' },
      { id: 'diluc', nameForAPI: 'Diluc', nameForYatta: 'Diluc' },
      { id: 'diona', nameForAPI: 'Diona', nameForYatta: 'Diona' },
      { id: 'dori', nameForAPI: 'Dori', nameForYatta: 'Dori' },
      { id: 'emilie', nameForAPI: 'Emilie', nameForYatta: 'Emilie' },
      { id: 'eula', nameForAPI: 'Eula', nameForYatta: 'Eula' },
      { id: 'faruzan', nameForAPI: 'Faruzan', nameForYatta: 'Faruzan' },
      { id: 'fischl', nameForAPI: 'Fischl', nameForYatta: 'Fischl' },
      { id: 'freminet', nameForAPI: 'Freminet', nameForYatta: 'Freminet' },
      { id: 'furina', nameForAPI: 'Furina', nameForYatta: 'Furina' },
      { id: 'gaming', nameForAPI: 'Gaming', nameForYatta: 'Gaming' },
      { id: 'ganyu', nameForAPI: 'Ganyu', nameForYatta: 'Ganyu' },
      { id: 'gorou', nameForAPI: 'Gorou', nameForYatta: 'Gorou' },
      { id: 'hu_tao', nameForAPI: 'Hu Tao', nameForYatta: 'Hutao' },
      { id: 'jean', nameForAPI: 'Jean', nameForYatta: 'Qin' },
      { id: 'kachina', nameForAPI: 'Kachina', nameForYatta: 'Kachina' },
      { id: 'kaedehara_kazuha', nameForAPI: 'Kaedehara Kazuha', nameForYatta: 'Kazuha' },
      { id: 'kaeya', nameForAPI: 'Kaeya', nameForYatta: 'Kaeya' },
      { id: 'kamisato_ayaka', nameForAPI: 'Kamisato Ayaka', nameForYatta: 'Ayaka' },
      { id: 'kamisato_ayato', nameForAPI: 'Kamisato Ayato', nameForYatta: 'Ayato' },
      { id: 'kaveh', nameForAPI: 'Kaveh', nameForYatta: 'Kaveh' },
      { id: 'keqing', nameForAPI: 'Keqing', nameForYatta: 'Keqing' },
      { id: 'kinich', nameForAPI: 'Kinich', nameForYatta: 'Kinich' },
      { id: 'kirara', nameForAPI: 'Kirara', nameForYatta: 'Momoka' },
      { id: 'klee', nameForAPI: 'Klee', nameForYatta: 'Klee' },
      { id: 'kujou_sara', nameForAPI: 'Kujou Sara', nameForYatta: 'Sara' },
      { id: 'kuki_shinobu', nameForAPI: 'Kuki Shinobu', nameForYatta: 'Shinobu' },
      { id: 'lan_yan', nameForAPI: 'Lan Yan', nameForYatta: 'Lanyan' },
      { id: 'layla', nameForAPI: 'Layla', nameForYatta: 'Layla' },
      { id: 'lisa', nameForAPI: 'Lisa', nameForYatta: 'Lisa' },
      { id: 'lynette', nameForAPI: 'Lynette', nameForYatta: 'Linette' },
      { id: 'lyney', nameForAPI: 'Lyney', nameForYatta: 'Liney' },
      { id: 'mavuika', nameForAPI: 'Mavuika', nameForYatta: 'Mavuika' },
      { id: 'mika', nameForAPI: 'Mika', nameForYatta: 'Mika' },
      { id: 'mona', nameForAPI: 'Mona', nameForYatta: 'Mona' },
      { id: 'mualani', nameForAPI: 'Mualani', nameForYatta: 'Mualani' },
      { id: 'nahida', nameForAPI: 'Nahida', nameForYatta: 'Nahida' },
      { id: 'navia', nameForAPI: 'Navia', nameForYatta: 'Navia' },
      { id: 'neuvillette', nameForAPI: 'Neuvillette', nameForYatta: 'Neuvillette' },
      { id: 'nilou', nameForAPI: 'Nilou', nameForYatta: 'Nilou' },
      { id: 'ningguang', nameForAPI: 'Ningguang', nameForYatta: 'Ningguang' },
      { id: 'noelle', nameForAPI: 'Noelle', nameForYatta: 'Noel' },
      { id: 'ororon', nameForAPI: 'Ororon', nameForYatta: 'Olorun' },
      { id: 'qiqi', nameForAPI: 'Qiqi', nameForYatta: 'Qiqi' },
      { id: 'raiden_shogun', nameForAPI: 'Raiden Shogun', nameForYatta: 'Shougun' },
      { id: 'razor', nameForAPI: 'Razor', nameForYatta: 'Razor' },
      { id: 'rosaria', nameForAPI: 'Rosaria', nameForYatta: 'Rosaria' },
      { id: 'sangonomiya_kokomi', nameForAPI: 'Sangonomiya Kokomi', nameForYatta: 'Kokomi' },
      { id: 'sayu', nameForAPI: 'Sayu', nameForYatta: 'Sayu' },
      { id: 'sethos', nameForAPI: 'Sethos', nameForYatta: 'Sethos' },
      { id: 'shenhe', nameForAPI: 'Shenhe', nameForYatta: 'Shenhe' },
      { id: 'shikanoin_heizou', nameForAPI: 'Shikanoin Heizou', nameForYatta: 'Heizo' },
      { id: 'sigewinne', nameForAPI: 'Sigewinne', nameForYatta: 'Sigewinne' },
      { id: 'sucrose', nameForAPI: 'Sucrose', nameForYatta: 'Sucrose' },
      { id: 'tartaglia', nameForAPI: 'Tartaglia', nameForYatta: 'Tartaglia' },
      { id: 'thoma', nameForAPI: 'Thoma', nameForYatta: 'Tohma' },
      { id: 'tighnari', nameForAPI: 'Tighnari', nameForYatta: 'Tighnari' },
      { id: 'venti', nameForAPI: 'Venti', nameForYatta: 'Venti' },
      { id: 'wanderer', nameForAPI: 'Wanderer', nameForYatta: 'Wanderer' },
      { id: 'wriothesley', nameForAPI: 'Wriothesley', nameForYatta: 'Wriothesley' },
      { id: 'xiangling', nameForAPI: 'Xiangling', nameForYatta: 'Xiangling' },
      { id: 'xianyun', nameForAPI: 'Xianyun', nameForYatta: 'Liuyun' },
      { id: 'xiao', nameForAPI: 'Xiao', nameForYatta: 'Xiao' },
      { id: 'xilonen', nameForAPI: 'Xilonen', nameForYatta: 'Xilonen' },
      { id: 'xingqiu', nameForAPI: 'Xingqiu', nameForYatta: 'Xingqiu' },
      { id: 'xinyan', nameForAPI: 'Xinyan', nameForYatta: 'Xinyan' },
      { id: 'yae_miko', nameForAPI: 'Yae Miko', nameForYatta: 'Yae' },
      { id: 'yanfei', nameForAPI: 'Yanfei', nameForYatta: 'Feiyan' },
      { id: 'yaoyao', nameForAPI: 'Yaoyao', nameForYatta: 'Yaoyao' },
      { id: 'yelan', nameForAPI: 'Yelan', nameForYatta: 'Yelan' },
      { id: 'yoimiya', nameForAPI: 'Yoimiya', nameForYatta: 'Yoimiya' },
      { id: 'yun_jin', nameForAPI: 'Yun Jin', nameForYatta: 'Yunjin' },
      { id: 'zhongli', nameForAPI: 'Zhongli', nameForYatta: 'Zhongli' },
      { id: 'yumemizuki_mizuki', nameForAPI: 'Yumemizuki Mizuki', nameForYatta: 'Mizuki' },
      { id: 'varesa', nameForAPI: 'Varesa', nameForYatta: 'Varesa' },
      { id: 'escoffier', nameForAPI: 'Escoffier', nameForYatta: 'Escoffier' },
      { id: 'skirk', nameForAPI: 'Skirk', nameForYatta: 'SkirkNew' },
      { id: 'ineffa', nameForAPI: 'Ineffa', nameForYatta: 'Ineffa' },
      { id: 'lauma', nameForAPI: 'Lauma', nameForYatta: 'Lauma' },
      { id: 'flins', nameForAPI: 'Flins', nameForYatta: 'Flins' },
      { id: 'iansan', nameForAPI: 'Iansan', nameForYatta: 'Iansan' },
      { id: 'ifa', nameForAPI: 'Ifa', nameForYatta: 'Ifa' },
      { id: 'dahlia', nameForAPI: 'Dahlia', nameForYatta: 'Dahlia' },
      { id: 'aino', nameForAPI: 'Aino', nameForYatta: 'Aino' }
    ];
    
    const characters: Character[] = [];
    const total = baseList.length;
    
    // Inicializar progreso
    this.progressSubject.next({current: 0, total});
    
    for (let i = 0; i < baseList.length; i++) {
      const baseChar = baseList[i];
      try {
        const response = await fetch(`https://genshin-db-api.vercel.app/api/v5/characters?query=${baseChar.nameForAPI}`);
        const apiData = await response.json();
        
        if (apiData && apiData.name) {
          const yattaImageUrl = `https://gi.yatta.moe/assets/UI/UI_AvatarIcon_${baseChar.nameForYatta}.png`;
          
          characters.push({
            id: baseChar.id,
            name: apiData.name,
            element: apiData.elementText,
            rarity: apiData.rarity,
            image: yattaImageUrl,
            weaponType: apiData.weaponText
          });
        }
        
        // Emitir progreso
        this.progressSubject.next({current: i + 1, total});
        
      } catch (error) {
        console.warn(`Could not fetch data for ${baseChar.nameForAPI}:`, error);
        // Emitir progreso incluso si hay error
        this.progressSubject.next({current: i + 1, total});
      }
    }
    
    return characters.sort((a, b) => {
      if (b.rarity !== a.rarity) {
        return b.rarity - a.rarity;
      }
      return a.name.localeCompare(b.name);
    });
  }

  // Método para limpiar cache si es necesario
  clearCache(): void {
    this.characters = null;
    this.loadingPromise = null;
  }
}