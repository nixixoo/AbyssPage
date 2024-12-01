import requests
from bs4 import BeautifulSoup
import os
import time

def download_character_icon(character_name):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/png,image/*,*/*;q=0.8'
    }
    
    url = f"https://genshin-impact.fandom.com/wiki/{character_name}/Gallery?file={character_name}_Icon.png"
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            img = soup.find('img', {'class': 'thumbimage'})
            
            if img and 'src' in img.attrs:
                img_url = img['src']
                if not img_url.startswith('http'):
                    img_url = 'https:' + img_url
                    
                img_response = requests.get(img_url, headers=headers)
                
                if img_response.status_code == 200:
                    file_path = f"character_icons/{character_name.lower()}_icon.webp"
                    with open(file_path, "wb") as f:
                        f.write(img_response.content)
                    print(f"✓ Downloaded {character_name}'s icon")
                    return True
                    
        print(f"✗ Failed to download {character_name}'s icon")
        return False
            
    except Exception as e:
        print(f"✗ Error downloading {character_name}: {str(e)}")
        return False

# Create directory if it doesn't exist
if not os.path.exists("character_icons"):
    os.makedirs("character_icons")

# List of all characters
characters = [
    "Aether", "Lumine"
]

print("Starting download of all character icons...")
success_count = 0

for character in characters:
    if download_character_icon(character):
        success_count += 1
    time.sleep(1)  # Add a small delay between downloads to be nice to the server

print(f"\nDownload completed! Successfully downloaded {success_count} out of {len(characters)} icons.")