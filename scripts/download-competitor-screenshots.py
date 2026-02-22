#!/usr/bin/env python3
"""
اسکریپت دانلود تصاویر اپلیکیشن‌ها از مارکت پلیس‌های ایرانی.
خروجی در docs/research/competitors/analyses/<competitor_id>/ ذخیره می‌شود.
"""

import requests
from bs4 import BeautifulSoup
import os
import time
from urllib.parse import urljoin

# User-Agent برای جلوگیری از بلاک شدن
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# اطلاعات رقبا
COMPETITORS = {
    'doriyar': {
        'name': 'دوریار',
        'cafebazaar': 'https://cafebazaar.ir/app/com.servicapp',
        'myket': 'https://myket.ir/app/com.servicapp'
    },
    'mashin-man': {
        'name': 'ماشین من',
        'cafebazaar': 'https://cafebazaar.ir/app/com.anasoftco.mycar',
        'myket': 'https://myket.ir/app/com.solu.mycar'
    },
    'khodroyar': {
        'name': 'خودرویار',
        'myket': 'https://myket.ir/app/com.serendip.carfriend.persian',
        'website': 'https://khodroyar.org/apps/khodroyar-app/'
    },
    'soupop': {
        'name': 'سوپاپ',
        'website': 'https://soupop.ir'
    },
    'virazh': {
        'name': 'ویراژ',
        'myket': 'https://myket.ir/app/ir.virazh.owner.twa',
        'website': 'https://virazh.ir/'
    }
}

def download_image(url, save_path):
    """دانلود یک تصویر از URL"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"خطا در دانلود {url}: {e}")
    return False

def extract_screenshots_cafebazaar(url, save_dir):
    """استخراج تصاویر از کافه‌بازار"""
    screenshots = []
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            patterns = [
                {'tag': 'img', 'class': 'screenshot'},
                {'tag': 'img', 'class': 'app-screenshot'},
                {'tag': 'img', 'class': 'screenshot-image'},
                {'tag': 'img', 'attrs': {'data-src': True}},
                {'tag': 'img', 'attrs': {'src': True}}
            ]
            for pattern in patterns:
                if 'class' in pattern:
                    imgs = soup.find_all(pattern['tag'], class_=pattern['class'])
                elif 'attrs' in pattern:
                    imgs = soup.find_all(pattern['tag'], attrs=pattern['attrs'])
                else:
                    imgs = soup.find_all(pattern['tag'])
                for img in imgs:
                    src = img.get('data-src') or img.get('src')
                    if src and ('screenshot' in src.lower() or 'screen' in src.lower()):
                        full_url = urljoin(url, src)
                        if full_url not in screenshots:
                            screenshots.append(full_url)
        for i, screenshot_url in enumerate(screenshots[:10]):
            filename = f'screenshot_{i+1}.jpg'
            filepath = os.path.join(save_dir, filename)
            if download_image(screenshot_url, filepath):
                print(f"✓ دانلود شد: {filename}")
            time.sleep(1)
    except Exception as e:
        print(f"خطا در استخراج از کافه‌بازار: {e}")
    return screenshots

def extract_screenshots_myket(url, save_dir):
    """استخراج تصاویر از مایکت"""
    screenshots = []
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            patterns = [
                {'tag': 'img', 'class': 'screenshot'},
                {'tag': 'img', 'class': 'app-screenshot'},
                {'tag': 'img', 'attrs': {'data-src': True}},
                {'tag': 'img', 'attrs': {'src': True}}
            ]
            for pattern in patterns:
                if 'class' in pattern:
                    imgs = soup.find_all(pattern['tag'], class_=pattern['class'])
                elif 'attrs' in pattern:
                    imgs = soup.find_all(pattern['tag'], attrs=pattern['attrs'])
                else:
                    imgs = soup.find_all(pattern['tag'])
                for img in imgs:
                    src = img.get('data-src') or img.get('src')
                    if src and ('screenshot' in src.lower() or 'screen' in src.lower()):
                        full_url = urljoin(url, src)
                        if full_url not in screenshots:
                            screenshots.append(full_url)
        for i, screenshot_url in enumerate(screenshots[:10]):
            filename = f'screenshot_{i+1}.jpg'
            filepath = os.path.join(save_dir, filename)
            if download_image(screenshot_url, filepath):
                print(f"✓ دانلود شد: {filename}")
            time.sleep(1)
    except Exception as e:
        print(f"خطا در استخراج از مایکت: {e}")
    return screenshots

def main():
    """تابع اصلی"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    base_dir = os.path.join(project_root, 'docs', 'research', 'competitors', 'analyses')

    for competitor_id, competitor_info in COMPETITORS.items():
        print(f"\n{'='*50}")
        print(f"در حال پردازش: {competitor_info['name']}")
        print(f"{'='*50}")

        competitor_dir = os.path.join(base_dir, competitor_id)
        os.makedirs(competitor_dir, exist_ok=True)

        if 'cafebazaar' in competitor_info:
            print(f"\n📱 کافه‌بازار: {competitor_info['cafebazaar']}")
            extract_screenshots_cafebazaar(competitor_info['cafebazaar'], competitor_dir)

        if 'myket' in competitor_info:
            print(f"\n📱 مایکت: {competitor_info['myket']}")
            extract_screenshots_myket(competitor_info['myket'], competitor_dir)

        if 'website' in competitor_info:
            print(f"\n🌐 وب‌سایت: {competitor_info['website']}")

        time.sleep(2)

    print(f"\n{'='*50}")
    print("✅ پردازش کامل شد!")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
