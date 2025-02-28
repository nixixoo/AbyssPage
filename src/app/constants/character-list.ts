export interface Character {
  id: string;
  name: string;
  element: string;
  rarity: number;
  image: string;
  weaponType: string;
}

export const characterList: Character[] = [
  {
    id: 'aether',
    name: 'Aether',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/aether_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'lumine',
    name: 'Lumine',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/lumine_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'albedo',
    name: 'Albedo',
    element: 'Geo',
    rarity: 5,
    image: 'assets/character_icons/albedo_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'alhaitham',
    name: 'Alhaitham',
    element: 'Dendro',
    rarity: 5,
    image: 'assets/character_icons/alhaitham_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'aloy',
    name: 'Aloy',
    element: 'Cryo',
    rarity: 5,
    image: 'assets/character_icons/aloy_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'amber',
    name: 'Amber',
    element: 'Pyro',
    rarity: 4,
    image: 'assets/character_icons/amber_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'arataki_itto',
    name: 'Arataki Itto',
    element: 'Geo',
    rarity: 5,
    image: 'assets/character_icons/arataki_itto_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'arlecchino',
    name: 'Arlecchino',
    element: 'Pyro',
    rarity: 5,
    image: 'assets/character_icons/arlecchino_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'baizhu',
    name: 'Baizhu',
    element: 'Dendro',
    rarity: 5,
    image: 'assets/character_icons/baizhu_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'barbara',
    name: 'Barbara',
    element: 'Hydro',
    rarity: 4,
    image: 'assets/character_icons/barbara_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'beidou',
    name: 'Beidou',
    element: 'Electro',
    rarity: 4,
    image: 'assets/character_icons/beidou_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'bennett',
    name: 'Bennett',
    element: 'Pyro',
    rarity: 4,
    image: 'assets/character_icons/bennett_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'candace',
    name: 'Candace',
    element: 'Hydro',
    rarity: 4,
    image: 'assets/character_icons/candace_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'charlotte',
    name: 'Charlotte',
    element: 'Cryo',
    rarity: 4,
    image: 'assets/character_icons/charlotte_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'chasca',
    name: 'Chasca',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/chasca_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'chevreuse',
    name: 'Chevreuse',
    element: 'Pyro',
    rarity: 4,
    image: 'assets/character_icons/chevreuse_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'chiori',
    name: 'Chiori',
    element: 'Geo',
    rarity: 5,
    image: 'assets/character_icons/chiori_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'chongyun',
    name: 'Chongyun',
    element: 'Cryo',
    rarity: 4,
    image: 'assets/character_icons/chongyun_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'citlali',
    name: 'Citlali',
    element: 'Cryo',
    rarity: 5,
    image: 'assets/character_icons/citlali_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'clorinde',
    name: 'Clorinde',
    element: 'Electro',
    rarity: 5,
    image: 'assets/character_icons/clorinde_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'collei',
    name: 'Collei',
    element: 'Dendro',
    rarity: 4,
    image: 'assets/character_icons/collei_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'cyno',
    name: 'Cyno',
    element: 'Electro',
    rarity: 5,
    image: 'assets/character_icons/cyno_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'dehya',
    name: 'Dehya',
    element: 'Pyro',
    rarity: 5,
    image: 'assets/character_icons/dehya_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'diluc',
    name: 'Diluc',
    element: 'Pyro',
    rarity: 5,
    image: 'assets/character_icons/diluc_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'diona',
    name: 'Diona',
    element: 'Cryo',
    rarity: 4,
    image: 'assets/character_icons/diona_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'dori',
    name: 'Dori',
    element: 'Electro',
    rarity: 4,
    image: 'assets/character_icons/dori_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'emilie',
    name: 'Emilie',
    element: 'Dendro',
    rarity: 5,
    image: 'assets/character_icons/emilie_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'eula',
    name: 'Eula',
    element: 'Cryo',
    rarity: 5,
    image: 'assets/character_icons/eula_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'faruzan',
    name: 'Faruzan',
    element: 'Anemo',
    rarity: 4,
    image: 'assets/character_icons/faruzan_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'fischl',
    name: 'Fischl',
    element: 'Electro',
    rarity: 4,
    image: 'assets/character_icons/fischl_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'freminet',
    name: 'Freminet',
    element: 'Cryo',
    rarity: 4,
    image: 'assets/character_icons/freminet_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'furina',
    name: 'Furina',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/furina_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    element: 'Pyro',
    rarity: 4,
    image: 'assets/character_icons/gaming_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'ganyu',
    name: 'Ganyu',
    element: 'Cryo',
    rarity: 5,
    image: 'assets/character_icons/ganyu_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'gorou',
    name: 'Gorou',
    element: 'Geo',
    rarity: 4,
    image: 'assets/character_icons/gorou_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'hu_tao',
    name: 'Hu Tao',
    element: 'Pyro',
    rarity: 5,
    image: 'assets/character_icons/hu_tao_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'jean',
    name: 'Jean',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/jean_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'kachina',
    name: 'Kachina',
    element: 'Geo',
    rarity: 4,
    image: 'assets/character_icons/kachina_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'kaedehara_kazuha',
    name: 'Kaedehara Kazuha',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/kaedehara_kazuha_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'kaeya',
    name: 'Kaeya',
    element: 'Cryo',
    rarity: 4,
    image: 'assets/character_icons/kaeya_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'kamisato_ayaka',
    name: 'Kamisato Ayaka',
    element: 'Cryo',
    rarity: 5,
    image: 'assets/character_icons/kamisato_ayaka_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'kamisato_ayato',
    name: 'Kamisato Ayato',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/kamisato_ayato_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'kaveh',
    name: 'Kaveh',
    element: 'Dendro',
    rarity: 4,
    image: 'assets/character_icons/kaveh_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'keqing',
    name: 'Keqing',
    element: 'Electro',
    rarity: 5,
    image: 'assets/character_icons/keqing_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'kinich',
    name: 'Kinich',
    element: 'Dendro',
    rarity: 5,
    image: 'assets/character_icons/kinich_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'kirara',
    name: 'Kirara',
    element: 'Dendro',
    rarity: 4,
    image: 'assets/character_icons/kirara_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'klee',
    name: 'Klee',
    element: 'Pyro',
    rarity: 5,
    image: 'assets/character_icons/klee_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'kujou_sara',
    name: 'Kujou Sara',
    element: 'Electro',
    rarity: 4,
    image: 'assets/character_icons/kujou_sara_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'kuki_shinobu',
    name: 'Kuki Shinobu',
    element: 'Electro',
    rarity: 4,
    image: 'assets/character_icons/kuki_shinobu_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'lan_yan',
    name: 'Lan Yan',
    element: 'Anemo',
    rarity: 4,
    image: 'assets/character_icons/lan_yan_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'layla',
    name: 'Layla',
    element: 'Cryo',
    rarity: 4,
    image: 'assets/character_icons/layla_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'lisa',
    name: 'Lisa',
    element: 'Electro',
    rarity: 4,
    image: 'assets/character_icons/lisa_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'lynette',
    name: 'Lynette',
    element: 'Anemo',
    rarity: 4,
    image: 'assets/character_icons/lynette_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'lyney',
    name: 'Lyney',
    element: 'Pyro',
    rarity: 5,
    image: 'assets/character_icons/lyney_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'mika',
    name: 'Mika',
    element: 'Cryo',
    rarity: 4,
    image: 'assets/character_icons/mika_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'mavuika',
    name: 'Mavuika',
    element: 'Pyro',
    rarity: 5,
    image: 'assets/character_icons/mavuika_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'mona',
    name: 'Mona',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/mona_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'mualani',
    name: 'Mualani',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/mualani_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'nahida',
    name: 'Nahida',
    element: 'Dendro',
    rarity: 5,
    image: 'assets/character_icons/nahida_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'navia',
    name: 'Navia',
    element: 'Geo',
    rarity: 5,
    image: 'assets/character_icons/navia_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'neuvillette',
    name: 'Neuvillette',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/neuvillette_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'nilou',
    name: 'Nilou',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/nilou_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'ningguang',
    name: 'Ningguang',
    element: 'Geo',
    rarity: 4,
    image: 'assets/character_icons/ningguang_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'noelle',
    name: 'Noelle',
    element: 'Geo',
    rarity: 4,
    image: 'assets/character_icons/noelle_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'ororon',
    name: 'Ororon',
    element: 'Electro',
    rarity: 4,
    image: 'assets/character_icons/ororon_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'qiqi',
    name: 'Qiqi',
    element: 'Cryo',
    rarity: 5,
    image: 'assets/character_icons/qiqi_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'raiden_shogun',
    name: 'Raiden Shogun',
    element: 'Electro',
    rarity: 5,
    image: 'assets/character_icons/raiden_shogun_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'razor',
    name: 'Razor',
    element: 'Electro',
    rarity: 4,
    image: 'assets/character_icons/razor_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'rosaria',
    name: 'Rosaria',
    element: 'Cryo',
    rarity: 4,
    image: 'assets/character_icons/rosaria_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'sangonomiya_kokomi',
    name: 'Sangonomiya Kokomi',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/sangonomiya_kokomi_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'sayu',
    name: 'Sayu',
    element: 'Anemo',
    rarity: 4,
    image: 'assets/character_icons/sayu_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'sethos',
    name: 'Sethos',
    element: 'Electro',
    rarity: 4,
    image: 'assets/character_icons/sethos_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'shenhe',
    name: 'Shenhe',
    element: 'Cryo',
    rarity: 5,
    image: 'assets/character_icons/shenhe_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'shikanoin_heizou',
    name: 'Shikanoin Heizou',
    element: 'Anemo',
    rarity: 4,
    image: 'assets/character_icons/shikanoin_heizou_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'sigewinne',
    name: 'Sigewinne',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/sigewinne_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'sucrose',
    name: 'Sucrose',
    element: 'Anemo',
    rarity: 4,
    image: 'assets/character_icons/sucrose_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'tartaglia',
    name: 'Tartaglia',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/tartaglia_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'thoma',
    name: 'Thoma',
    element: 'Pyro',
    rarity: 4,
    image: 'assets/character_icons/thoma_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'tighnari',
    name: 'Tighnari',
    element: 'Dendro',
    rarity: 5,
    image: 'assets/character_icons/tighnari_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'venti',
    name: 'Venti',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/venti_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'wanderer',
    name: 'Wanderer',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/wanderer_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'wriothesley',
    name: 'Wriothesley',
    element: 'Cryo',
    rarity: 5,
    image: 'assets/character_icons/wriothesley_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'xiangling',
    name: 'Xiangling',
    element: 'Pyro',
    rarity: 4,
    image: 'assets/character_icons/xiangling_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'xianyun',
    name: 'Xianyun',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/xianyun_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'xiao',
    name: 'Xiao',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/xiao_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'xilonen',
    name: 'Xilonen',
    element: 'Geo',
    rarity: 5,
    image: 'assets/character_icons/xilonen_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'xingqiu',
    name: 'Xingqiu',
    element: 'Hydro',
    rarity: 4,
    image: 'assets/character_icons/xingqiu_icon.webp',
    weaponType: 'Sword'
  },
  {
    id: 'xinyan',
    name: 'Xinyan',
    element: 'Pyro',
    rarity: 4,
    image: 'assets/character_icons/xinyan_icon.webp',
    weaponType: 'Claymore'
  },
  {
    id: 'yae_miko',
    name: 'Yae Miko',
    element: 'Electro',
    rarity: 5,
    image: 'assets/character_icons/yae_miko_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'yanfei',
    name: 'Yanfei',
    element: 'Pyro',
    rarity: 4,
    image: 'assets/character_icons/yanfei_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'yaoyao',
    name: 'Yaoyao',
    element: 'Dendro',
    rarity: 4,
    image: 'assets/character_icons/yaoyao_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'yelan',
    name: 'Yelan',
    element: 'Hydro',
    rarity: 5,
    image: 'assets/character_icons/yelan_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'yoimiya',
    name: 'Yoimiya',
    element: 'Pyro',
    rarity: 5,
    image: 'assets/character_icons/yoimiya_icon.webp',
    weaponType: 'Bow'
  },
  {
    id: 'yumemizuki_mizuki',
    name: 'Yumemizuki Mizuki',
    element: 'Anemo',
    rarity: 5,
    image: 'assets/character_icons/yumemizuki_mizuki_icon.webp',
    weaponType: 'Catalyst'
  },
  {
    id: 'yun_jin',
    name: 'Yun Jin',
    element: 'Geo',
    rarity: 4,
    image: 'assets/character_icons/yun_jin_icon.webp',
    weaponType: 'Polearm'
  },
  {
    id: 'zhongli',
    name: 'Zhongli',
    element: 'Geo',
    rarity: 5,
    image: 'assets/character_icons/zhongli_icon.webp',
    weaponType: 'Polearm'
  }
  // ... copy all the characters from characters.component.ts
]; 