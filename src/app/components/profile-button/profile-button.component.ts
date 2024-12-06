import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take, takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { UiService } from '../../services/ui.service';
import { Subject } from 'rxjs';

interface AvatarOption {
  url: string;
  name: string;
  type: 'character' | 'special';
}

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' })
        )
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'scale(0.8)' })
        )
      ])
    ]),
    trigger('slideIn', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', [
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class ProfileButtonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('menuContent') menuContent!: ElementRef;
  private destroy$ = new Subject<void>();
  showAvatarSelector = false;
  menuHeight = 0;
  searchQuery: string = '';
  isLoggedIn = false;
  currentAvatar: string = 'assets/images/default-avatar.png';
  isDarkened = false;
  avatarLoaded: boolean = false;
  
  avatarOptions: AvatarOption[] = [
    { url: 'assets/character_profile/albedo_avatar.png', name: 'Albedo', type: 'character' },
    { url: 'assets/character_profile/alhaitham_avatar.png', name: 'Alhaitham', type: 'character' },
    { url: 'assets/character_profile/aloy_avatar.png', name: 'Aloy', type: 'character' },
    { url: 'assets/character_profile/amber_avatar.png', name: 'Amber', type: 'character' },
    { url: 'assets/character_profile/amber_outrider.webp', name: 'Amber • Outrider', type: 'character' },
    { url: 'assets/character_profile/arataki_itto_avatar.png', name: 'Arataki Itto', type: 'character' },
    { url: 'assets/character_profile/arlecchino_avatar.png', name: 'Arlecchino', type: 'character' },
    { url: 'assets/character_profile/baizhu_avatar.png', name: 'Baizhu', type: 'character' },
    { url: 'assets/character_profile/barbara_avatar.png', name: 'Barbara', type: 'character' },
    { url: 'assets/character_profile/barbara_summer.webp', name: 'Barbara • Summer Skin', type: 'character' },
    { url: 'assets/character_profile/beidou_avatar.png', name: 'Beidou', type: 'character' },
    { url: 'assets/character_profile/bennett_avatar.png', name: 'Bennett', type: 'character' },
    { url: 'assets/character_profile/candace_avatar.png', name: 'Candace', type: 'character' },
    { url: 'assets/character_profile/charlotte_avatar.png', name: 'Charlotte', type: 'character' },
    { url: 'assets/character_profile/chasca_avatar.png', name: 'Chasca', type: 'character' },
    { url: 'assets/character_profile/chevreuse_avatar.png', name: 'Chevreuse', type: 'character' },
    { url: 'assets/character_profile/chiori_avatar.png', name: 'Chiori', type: 'character' },
    { url: 'assets/character_profile/chongyun_avatar.png', name: 'Chongyun', type: 'character' },
    { url: 'assets/character_profile/clorinde_avatar.png', name: 'Clorinde', type: 'character' },
    { url: 'assets/character_profile/collei_avatar.png', name: 'Collei', type: 'character' },
    { url: 'assets/character_profile/cyno_avatar.png', name: 'Cyno', type: 'character' },
    { url: 'assets/character_profile/dehya_avatar.png', name: 'Dehya', type: 'character' },
    { url: 'assets/character_profile/diluc_avatar.png', name: 'Diluc', type: 'character' },
    { url: 'assets/character_profile/diluc_red.webp', name: 'Diluc • Red Dead of Night', type: 'character' },
    { url: 'assets/character_profile/diona_avatar.png', name: 'Diona', type: 'character' },
    { url: 'assets/character_profile/dori_avatar.png', name: 'Dori', type: 'character' },
    { url: 'assets/character_profile/emilie_avatar.png', name: 'Emilie', type: 'character' },
    { url: 'assets/character_profile/eula_avatar.png', name: 'Eula', type: 'character' },
    { url: 'assets/character_profile/faruzan_avatar.png', name: 'Faruzan', type: 'character' },
    { url: 'assets/character_profile/fischl_avatar.png', name: 'Fischl', type: 'character' },
    { url: 'assets/character_profile/fischl_ein.webp', name: 'Fischl • Ein Immernachtstraum', type: 'character' },
    { url: 'assets/character_profile/freminet_avatar.png', name: 'Freminet', type: 'character' },
    { url: 'assets/character_profile/furina_avatar.png', name: 'Furina', type: 'character' },
    { url: 'assets/character_profile/gaming_avatar.png', name: 'Gaming', type: 'character' },
    { url: 'assets/character_profile/ganyu_avatar.png', name: 'Ganyu', type: 'character' },
    { url: 'assets/character_profile/ganyu_twilight.webp', name: 'Ganyu • Twilight Blossom', type: 'character' },
    { url: 'assets/character_profile/gorou_avatar.png', name: 'Gorou', type: 'character' },
    { url: 'assets/character_profile/hu_tao_avatar.png', name: 'Hu Tao', type: 'character' },
    { url: 'assets/character_profile/jean_avatar.png', name: 'Jean', type: 'character' },
    { url: 'assets/character_profile/jean_summer.webp', name: 'Jean • Sea Breeze Dandelion', type: 'character' },
    { url: 'assets/character_profile/kachina_avatar.png', name: 'Kachina', type: 'character' },
    { url: 'assets/character_profile/kaedehara_kazuha_avatar.png', name: 'Kaedehara Kazuha', type: 'character' },
    { url: 'assets/character_profile/kaeya_avatar.png', name: 'Kaeya', type: 'character' },
    { url: 'assets/character_profile/kaeya_sailwind.webp', name: 'Kaeya • Sailwind Shadow', type: 'character' },
    { url: 'assets/character_profile/kamisato_ayaka_avatar.png', name: 'Kamisato Ayaka', type: 'character' },
    { url: 'assets/character_profile/kamisato_ayaka_springbloom.webp', name: 'Kamisato Ayaka • Springbloom Missive', type: 'character' },
    { url: 'assets/character_profile/kamisato_ayato_avatar.png', name: 'Kamisato Ayato', type: 'character' },
    { url: 'assets/character_profile/kaveh_avatar.png', name: 'Kaveh', type: 'character' },
    { url: 'assets/character_profile/keqing_avatar.png', name: 'Keqing', type: 'character' },
    { url: 'assets/character_profile/keqing_opulent.webp', name: 'Keqing • Opulent Splendor', type: 'character' },
    { url: 'assets/character_profile/kinich_avatar.png', name: 'Kinich', type: 'character' },
    { url: 'assets/character_profile/kirara_avatar.png', name: 'Kirara', type: 'character' },
    { url: 'assets/character_profile/kirara_phantom.webp', name: 'Kirara • Phantom Fox Apparition', type: 'character' },
    { url: 'assets/character_profile/klee_avatar.png', name: 'Klee', type: 'character' },
    { url: 'assets/character_profile/klee_blossoming.webp', name: 'Klee • Blossoming Starlight', type: 'character' },
    { url: 'assets/character_profile/kujou_sara_avatar.png', name: 'Kujou Sara', type: 'character' },
    { url: 'assets/character_profile/kuki_shinobu_avatar.png', name: 'Kuki Shinobu', type: 'character' },
    { url: 'assets/character_profile/layla_avatar.png', name: 'Layla', type: 'character' },
    { url: 'assets/character_profile/lisa_avatar.png', name: 'Lisa', type: 'character' },
    { url: 'assets/character_profile/lisa_sobriquet.webp', name: 'Lisa • A Sobriquet Under Shade', type: 'character' },
    { url: 'assets/character_profile/lynette_avatar.png', name: 'Lynette', type: 'character' },
    { url: 'assets/character_profile/lyney_avatar.png', name: 'Lyney', type: 'character' },
    { url: 'assets/character_profile/mika_avatar.png', name: 'Mika', type: 'character' },
    { url: 'assets/character_profile/mona_avatar.png', name: 'Mona', type: 'character' },
    { url: 'assets/character_profile/mona_pact.webp', name: 'Mona • Destiny\'s Mockery', type: 'character' },
    { url: 'assets/character_profile/mualani_avatar.png', name: 'Mualani', type: 'character' },
    { url: 'assets/character_profile/nahida_avatar.png', name: 'Nahida', type: 'character' },
    { url: 'assets/character_profile/navia_avatar.png', name: 'Navia', type: 'character' },
    { url: 'assets/character_profile/neuvillette_avatar.png', name: 'Neuvillette', type: 'character' },
    { url: 'assets/character_profile/nilou_avatar.png', name: 'Nilou', type: 'character' },
    { url: 'assets/character_profile/nilou_breeze.webp', name: 'Nilou • Warm Fragrance in the Night', type: 'character' },
    { url: 'assets/character_profile/ningguang_avatar.png', name: 'Ningguang', type: 'character' },
    { url: 'assets/character_profile/ningguang_orchid.webp', name: 'Ningguang • Orchid\'s Evening Gown', type: 'character' },
    { url: 'assets/character_profile/noelle_avatar.png', name: 'Noelle', type: 'character' },
    { url: 'assets/character_profile/ororon_avatar.png', name: 'Ororon', type: 'character' },
    { url: 'assets/character_profile/qiqi_avatar.png', name: 'Qiqi', type: 'character' },
    { url: 'assets/character_profile/raiden_shogun_avatar.png', name: 'Raiden Shogun', type: 'character' },
    { url: 'assets/character_profile/razor_avatar.png', name: 'Razor', type: 'character' },
    { url: 'assets/character_profile/rosaria_avatar.png', name: 'Rosaria', type: 'character' },
    { url: 'assets/character_profile/rosaria_curch.webp', name: 'Rosaria • To the Church\'s Free Spirit', type: 'character' },
    { url: 'assets/character_profile/sangonomiya_kokomi_avatar.png', name: 'Sangonomiya Kokomi', type: 'character' },
    { url: 'assets/character_profile/sayu_avatar.png', name: 'Sayu', type: 'character' },
    { url: 'assets/character_profile/sethos_avatar.png', name: 'Sethos', type: 'character' },
    { url: 'assets/character_profile/shenhe_avatar.png', name: 'Shenhe', type: 'character' },
    { url: 'assets/character_profile/shenhe_frostflower.webp', name: 'Shenhe • Frostflower Dew', type: 'character' },
    { url: 'assets/character_profile/shikanoin_heizou_avatar.png', name: 'Shikanoin Heizou', type: 'character' },
    { url: 'assets/character_profile/sigewinne_avatar.png', name: 'Sigewinne', type: 'character' },
    { url: 'assets/character_profile/sucrose_avatar.png', name: 'Sucrose', type: 'character' },
    { url: 'assets/character_profile/tartaglia_avatar.png', name: 'Tartaglia', type: 'character' },
    { url: 'assets/character_profile/thoma_avatar.png', name: 'Thoma', type: 'character' },
    { url: 'assets/character_profile/tighnari_avatar.png', name: 'Tighnari', type: 'character' },
    { url: 'assets/character_profile/venti_avatar.png', name: 'Venti', type: 'character' },
    { url: 'assets/character_profile/wanderer_avatar.png', name: 'Wanderer', type: 'character' },
    { url: 'assets/character_profile/wriothesley_avatar.png', name: 'Wriothesley', type: 'character' },
    { url: 'assets/character_profile/xiangling_avatar.png', name: 'Xiangling', type: 'character' },
    { url: 'assets/character_profile/xianyun_avatar.png', name: 'Xianyun', type: 'character' },
    { url: 'assets/character_profile/xiao_avatar.png', name: 'Xiao', type: 'character' },
    { url: 'assets/character_profile/xilonen_avatar.png', name: 'Xilonen', type: 'character' },
    { url: 'assets/character_profile/xingqiu_avatar.png', name: 'Xingqiu', type: 'character' },
    { url: 'assets/character_profile/xingqiu_bamboo.webp', name: 'Xingqiu • Bamboo Rain', type: 'character' },
    { url: 'assets/character_profile/xinyan_avatar.png', name: 'Xinyan', type: 'character' },
    { url: 'assets/character_profile/yae_miko_avatar.png', name: 'Yae Miko', type: 'character' },
    { url: 'assets/character_profile/yanfei_avatar.png', name: 'Yanfei', type: 'character' },
    { url: 'assets/character_profile/yaoyao_avatar.png', name: 'Yaoyao', type: 'character' },
    { url: 'assets/character_profile/yelan_avatar.png', name: 'Yelan', type: 'character' },
    { url: 'assets/character_profile/yoimiya_avatar.png', name: 'Yoimiya', type: 'character' },
    { url: 'assets/character_profile/yun_jin_avatar.png', name: 'Yun Jin', type: 'character' },
    { url: 'assets/character_profile/zhongli_avatar.png', name: 'Zhongli', type: 'character' },
    { url: 'assets/character_profile/Ann_Mary-Ann_Avatar.webp', name: 'Mary-Ann', type: 'special' },
    { url: 'assets/character_profile/Arama_Avatar.webp', name: 'Arama', type: 'special' },
    { url: 'assets/character_profile/Bloomguard_Sorush_Avatar.webp', name: 'Bloomguard Sorush', type: 'special' },
    { url: 'assets/character_profile/Caterpillar_Avatar.webp', name: 'Caterpillar', type: 'special' },
    { url: 'assets/character_profile/Crest_of_Artifice_Avatar.webp', name: 'Crest of Artifice', type: 'special' },
    { url: 'assets/character_profile/Dainichi_Mikoshi_Avatar.webp', name: 'Dainichi Mikoshi', type: 'special' },
    { url: 'assets/character_profile/Hanachirusatos_Mask_Avatar.webp', name: 'Hanachirusato\'s Mask', type: 'special' },
    { url: 'assets/character_profile/Jeht_and_Benben_Avatar.webp', name: 'Jeht and Benben', type: 'special' },
    { url: 'assets/character_profile/Last_Hero_of_Cinder_City_Avatar.webp', name: 'Last Hero of Cinder City', type: 'special' },
    { url: 'assets/character_profile/Monsieur_Os_Avatar.webp', name: 'Monsieur Os', type: 'special' },
    { url: 'assets/character_profile/Mother_of_the_Jinn_Avatar.webp', name: 'Mother of the Jinn', type: 'special' },
    { url: 'assets/character_profile/Nice_to_Meet_You_Avatar.webp', name: 'Nice to Meet You', type: 'special' },
    { url: 'assets/character_profile/Pahsiv_Avatar.webp', name: 'Pahsiv', type: 'special' },
    { url: 'assets/character_profile/Provisional_Head_Priestess_of_the_Asase_Shrine_Avatar.webp', name: 'Provisional Head Priestess', type: 'special' },
    { url: 'assets/character_profile/Rainjade_Oblation_Avatar.webp', name: 'Rainjade Oblation', type: 'special' },
    { url: 'assets/character_profile/The_Formless_Society_Avatar.webp', name: 'The Formless Society', type: 'special' },
    { url: 'assets/character_profile/The_Thunderbird_and_the_Boy_Avatar.webp', name: 'The Thunderbird and the Boy', type: 'special' },
    { url: 'assets/character_profile/Your_Saurian_companion_Avatar.webp', name: 'Your Saurian Companion', type: 'special' },
    { url: 'assets/character_profile/Zhiqiongs_Signature_Avatar.webp', name: 'Zhiqiong\'s Signature', type: 'special' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private firestore: Firestore,
    private uiService: UiService
  ) {
    console.log('ProfileButton: Initializing...');
    // Subscribe to auth state changes
    this.authService.isAuthenticated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (isAuthenticated) => {
        console.log('ProfileButton: Auth state changed:', isAuthenticated);
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          this.loadUserAvatar();
        }
      }
    );

    // Subscribe to darkened state
    this.uiService.isDarkened$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (isDarkened: boolean) => {
        console.log('Profile button darkened state:', isDarkened);
        this.isDarkened = isDarkened;
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadUserAvatar() {
    const user = await this.authService.getCurrentUser();
    if (user && user.avatar) {
      this.currentAvatar = user.avatar;
    }
  }

  ngAfterViewInit() {
    this.calculateMenuHeight();
  }

  calculateMenuHeight() {
    if (this.menuContent) {
      const menuItems = this.menuContent.nativeElement.querySelectorAll('.menu-item');
      let totalHeight = 0;
      
      menuItems.forEach((item: HTMLElement) => {
        totalHeight += item.offsetHeight;
      });

      // Añadir padding y márgenes
      totalHeight += 32; // 16px padding top + 16px padding bottom
      
      this.menuHeight = totalHeight;
      
      // Aplicar altura calculada
      const menu = this.menuContent.nativeElement;
      menu.style.setProperty('--menu-height', `${this.menuHeight}px`);
    }
  }

  navigateToProfile() {
    console.log('ProfileButton: Navigating to profile...');
    this.router.navigate(['profile', 'me']);
  }

  openAvatarSelector() {
    this.showAvatarSelector = true;
  }

  closeAvatarSelector() {
    this.showAvatarSelector = false;
  }

  async selectAvatar(avatar: AvatarOption) {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) {
        console.error('No user found');
        return;
      }

      // Update Firestore document
      const userRef = doc(this.firestore, 'creators', currentUser.uid);
      await updateDoc(userRef, {
        avatar: avatar.url
      });

      // Update the current avatar immediately
      this.currentAvatar = avatar.url;

      console.log('Avatar updated successfully:', avatar.url);
      this.closeAvatarSelector();
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Add a getter for sorted avatars
  get sortedAvatarOptions(): AvatarOption[] {
    return [...this.avatarOptions].sort((a, b) => {
      // First sort by type (characters first)
      if (a.type !== b.type) {
        return a.type === 'character' ? -1 : 1;
      }
      // Then sort by name within each type
      return a.name.localeCompare(b.name);
    });
  }

  get filteredAvatars(): AvatarOption[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.sortedAvatarOptions;

    return this.sortedAvatarOptions.filter(avatar => 
      avatar.name.toLowerCase().includes(query)
    );
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }
}
