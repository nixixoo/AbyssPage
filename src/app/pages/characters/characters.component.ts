import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { Creator } from '../../interfaces/creator.interface';
import { CreatorService } from '../../services/creator.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil, firstValueFrom, first } from 'rxjs';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' })
        )
      ]),
      transition(':leave', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'scale(0.95)' })
        )
      ]),
      transition('* => *', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    trigger('buttonAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(100%)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('800ms ease-out', style({ 
          opacity: 0,
          transform: 'scale(0.95)'
        }))
      ])
    ])
  ]
})
export class CharactersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  creator: Creator | null = null;
  characterList: { 
    id: string;
    name: string;
    element: string;
    rarity: number;
    image: string;
    weaponType: string;
  }[] = [];
  displayedCharacters: typeof this.characterList = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  characterConstellations: { [key: string]: number } = {};
  pendingChanges: {
    characters: string[];
    constellations: { [key: string]: number };
  } = {
    characters: [],
    constellations: {}
  };

  elements = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];
  weapons = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];
  
  activeFilters = {
    element: null as string | null,
    weapon: null as string | null,
    rarity: null as number | null
  };

  isSidebarOpen = false;

  selectedRarity: number | null = null;

  authChecked = false;
  isAuthenticated = false;

  constructor(
    private creatorService: CreatorService,
    private authService: AuthService,
    public router: Router
  ) {
    this.characterList = [
      {
        id: 'aether',
        name: 'Aether',
        element: 'Anemo',
        rarity: 5,
        image: 'assets/character_icons/aether_icon.webp',
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
        id: 'lumine',
        name: 'Lumine',
        element: 'Anemo',
        rarity: 5,
        image: 'assets/character_icons/lumine_icon.webp',
        weaponType: 'Sword'
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
    ];
    this.displayedCharacters = this.characterList;
  }

  async ngOnInit() {
    try {
      this.isLoading = true;
      this.displayedCharacters = [];
      
      // Force minimum 2 seconds loading time
      const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      this.authService.isAuthenticated$
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(async (isAuthenticated) => {
          this.isAuthenticated = isAuthenticated;
          
          if (isAuthenticated) {
            // Process user data
            const userSubscription = this.authService.currentUser$
              .pipe(
                takeUntil(this.destroy$)
              )
              .subscribe(user => {
                if (user) {
                  this.creator = user;
                  this.pendingChanges.characters = user.characters 
                    ? Object.keys(user.characters).filter(key => user.characters[key])
                    : [];
                  
                  if (user.constellations) {
                    this.characterConstellations = { ...user.constellations };
                    this.pendingChanges.constellations = { ...user.constellations };
                  }
                }
              });
          }

          // Wait for minimum loading time
          await minimumLoadingTime;
          
          // Set authChecked after a small delay to allow animations to complete
          setTimeout(() => {
            this.authChecked = true;
            this.isLoading = false;
            
            if (isAuthenticated) {
              setTimeout(() => {
                this.displayedCharacters = this.characterList;
              }, 300);
            }
          }, 100); // Small delay before changing authChecked
        });

    } catch (error) {
      console.error('Error loading user data:', error);
      this.errorMessage = 'Error loading user data';
      this.isLoading = false;
      this.authChecked = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isCharacterOwned(characterId: string): boolean {
    const isOwned = this.pendingChanges.characters.includes(characterId);
    return isOwned;
  }

  getCharacterCons(characterId: string): number {
    return this.pendingChanges.constellations[characterId] || 0;
  }

  toggleCharacter(character: any) {
    const card = document.querySelector(`[data-character-id="${character.id}"]`);
    if (!card || card.classList.contains('toggling')) return; // Prevent double animations
    
    const isCurrentlyOwned = this.pendingChanges.characters.includes(character.id);
    
    // Remove any existing animation classes first
    card.classList.remove('to-owned', 'to-locked');
    
    // Add new animation classes
    card.classList.add('toggling');
    card.classList.add(isCurrentlyOwned ? 'to-locked' : 'to-owned');

    setTimeout(() => {
      if (isCurrentlyOwned) {
        this.pendingChanges.characters = this.pendingChanges.characters.filter(id => id !== character.id);
        delete this.pendingChanges.constellations[character.id];
      } else {
        this.pendingChanges.characters.push(character.id);
        this.pendingChanges.constellations[character.id] = 0;
      }
      
      // Clean up animation classes
      requestAnimationFrame(() => {
        card.classList.remove('toggling', 'to-owned', 'to-locked');
      });
    }, 400);
  }

  filterByElement(element: string) {
    this.activeFilters.element = this.activeFilters.element === element ? null : element;
    this.applyFilters();
  }

  filterByWeapon(weapon: string) {
    this.activeFilters.weapon = this.activeFilters.weapon === weapon ? null : weapon;
    this.applyFilters();
  }

  filterByRarity(rarity: number) {
    this.selectedRarity = this.selectedRarity === rarity ? null : rarity;
    this.applyFilters();
  }

  private applyFilters() {
    // Implementation of filter logic
    let filteredList = [...this.characterList];

    if (this.activeFilters.element) {
      filteredList = filteredList.filter(char => char.element === this.activeFilters.element);
    }

    if (this.activeFilters.weapon) {
      filteredList = filteredList.filter(char => char.weaponType === this.activeFilters.weapon);
    }

    if (this.selectedRarity) {
      filteredList = filteredList.filter(char => char.rarity === this.selectedRarity);
    }

    // Update your displayed list
    this.displayedCharacters = filteredList;
  }

  increaseConsLevel(event: Event, character: any) {
    event.stopPropagation();
    const currentCons = this.pendingChanges.constellations[character.id] || 0;
    if (currentCons < 6) {
      this.pendingChanges.constellations[character.id] = currentCons + 1;
      this.animateConsNumber(character.id);
    }
  }

  decreaseConsLevel(event: Event, character: any) {
    event.stopPropagation();
    const currentCons = this.pendingChanges.constellations[character.id] || 0;
    if (currentCons > 0) {
      this.pendingChanges.constellations[character.id] = currentCons - 1;
      this.animateConsNumber(character.id);
    }
  }

  private animateConsNumber(characterId: string) {
    const consElement = document.querySelector(`[data-character-id="${characterId}"] .cons-level`) as HTMLElement;
    if (consElement) {
      consElement.classList.remove('bounce');
      // Force a reflow to restart the animation
      void consElement.offsetWidth;
      consElement.classList.add('bounce');
    }
  }

  updateCharacterCons(characterId: string, consLevel: number) {
    this.characterConstellations[characterId] = consLevel;
  }

  // New method to save changes
  saveChanges() {
    if (!this.creator) return;

    this.isLoading = true;
    
    // Convert array to simple object with boolean values
    const charactersObject = this.pendingChanges.characters.reduce((acc, charId) => {
      acc[charId] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    const updatedCreator: Creator = {
      ...this.creator,
      characters: charactersObject,
      constellations: this.pendingChanges.constellations
    };

    this.creatorService.updateCreator(updatedCreator).subscribe({
      next: (response) => {
        this.creator = response;
        this.characterConstellations = { ...this.pendingChanges.constellations };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving changes:', error);
        this.isLoading = false;
      }
    });
  }

  // New method to discard changes
  discardChanges() {
    if (this.creator) {
      // Convert object to array of character IDs
      this.pendingChanges.characters = this.creator.characters 
        ? Object.keys(this.creator.characters)
        : [];
      this.pendingChanges.constellations = { ...this.characterConstellations };
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  isRaritySelected(rarity: number): boolean {
    return this.selectedRarity === rarity;
  }

  isWeaponSelected(weapon: string): boolean {
    return this.activeFilters.weapon === weapon;
  }

  isElementSelected(element: string): boolean {
    return this.activeFilters.element === element;
  }

  // Add this method to check if there are pending changes
  hasPendingChanges(): boolean {
    if (!this.creator) return false;

    // Check for character ownership changes
    const currentCharacters = this.creator.characters ? Object.keys(this.creator.characters) : [];
    if (currentCharacters.length !== this.pendingChanges.characters.length) return true;
    
    // Check for constellation changes
    for (const charId in this.pendingChanges.constellations) {
      if (this.pendingChanges.constellations[charId] !== (this.characterConstellations[charId] || 0)) {
        return true;
      }
    }

    return false;
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
