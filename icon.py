import requests
from bs4 import BeautifulSoup
import os
import time

def download_character_icon(character_name):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/png,image/*,*/*;q=0.8'
    }
    
    url = f"https://genshin-impact.fandom.com/wiki/{character_name}_(Avatar)?file={character_name}_Avatar.png"
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            img = soup.find('a', {'class': 'image-thumbnail'}).find('img')
            
            if img and 'src' in img.attrs:
                img_url = img['src']
                if not img_url.startswith('http'):
                    img_url = 'https:' + img_url
                    
                img_response = requests.get(img_url, headers=headers)
                
                if img_response.status_code == 200:
                    file_path = f"character_icons/{character_name.lower()}_avatar.png"
                    with open(file_path, "wb") as f:
                        f.write(img_response.content)
                    print(f"✓ Downloaded {character_name}'s avatar")
                    return True
                    
        print(f"✗ Failed to download {character_name}'s avatar")
        return False
            
    except Exception as e:
        print(f"✗ Error downloading {character_name}: {str(e)}")
        return False

# Create directory if it doesn't exist
if not os.path.exists("character_icons"):
    os.makedirs("character_icons")

# List of all characters
characters = [
    "Albedo", "Alhaitham", "Aloy", "Amber", "Arataki_Itto", "Arlecchino", "Baizhu",
    "Barbara", "Beidou", "Bennett", "Candace", "Charlotte", "Chasca", "Chevreuse",
    "Chiori", "Chongyun", "Clorinde", "Collei", "Cyno", "Dehya", "Diluc", "Diona",
    "Dori", "Emilie", "Eula", "Faruzan", "Fischl", "Freminet", "Furina", "Gaming",
    "Ganyu", "Gorou", "Hu_Tao", "Jean", "Kachina", "Kaedehara_Kazuha", "Kaeya",
    "Kamisato_Ayaka", "Kamisato_Ayato", "Kaveh", "Keqing", "Kinich", "Kirara",
    "Klee", "Kujou_Sara", "Kuki_Shinobu", "Layla", "Lisa", "Lynette", "Lyney",
    "Mika", "Mona", "Mualani", "Nahida", "Navia", "Neuvillette", "Nilou",
    "Ningguang", "Noelle", "Ororon", "Qiqi", "Raiden_Shogun", "Razor", "Rosaria",
    "Sangonomiya_Kokomi", "Sayu", "Sethos", "Shenhe", "Shikanoin_Heizou",
    "Sigewinne", "Sucrose", "Tartaglia", "Thoma", "Tighnari", "Traveler", "Venti",
    "Wanderer", "Wriothesley", "Xiangling", "Xianyun", "Xiao", "Xilonen", "Xingqiu",
    "Xinyan", "Yae_Miko", "Yanfei", "Yaoyao", "Yelan", "Yoimiya", "Yun_Jin", "Zhongli"
]

print("Starting download of all character icons...")
success_count = 0

for character in characters:
    if download_character_icon(character):
        success_count += 1
    time.sleep(1)  # Add a small delay between downloads to be nice to the server

print(f"\nDownload completed! Successfully downloaded {success_count} out of {len(characters)} icons.")