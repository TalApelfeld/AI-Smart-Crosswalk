import os
import sys
import argparse
import json
import requests
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# 1. טעינת משתני סביבה (מומלץ לשים את המפתחות בקובץ .env)
load_dotenv()

# 2. הגדרת Cloudinary
# ודא שהמשתנים האלו קיימים בקובץ .env שלך או החלף במחרוזות (פחות מומלץ)
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)

# Configuration
API_URL = 'http://localhost:3000/api/alerts'  # Backend API URL

# Default values
DEFAULT_LOCATION = {
    'city': 'Tel Aviv',
    'street': 'Dizengoff',
    'number': '50'
}
DEFAULT_CAMERA_ID = '69617b55eb7ffca4f1000bb5'

def upload_to_cloudinary(image_path):
    """
    Uploads an image to Cloudinary and returns the secure URL.
    """
    print(f" ☁️  Uploading to Cloudinary: {os.path.basename(image_path)}...")
    try:
        response = cloudinary.uploader.upload(image_path)
        url = response.get("secure_url")
        print(f"    ✅ Upload success: {url}")
        return url
    except Exception as e:
        print(f"    ❌ Cloudinary Upload Error: {e}")
        return None

def create_alert(image_path, camera_id=None, location=None, danger_level=None):
    """
    Create an alert in MongoDB by sending the Cloudinary URL and metadata
    """
    
    if not os.path.exists(image_path):
        print(f" ❌ Error: Image file not found: {image_path}")
        return None
    
    # --- שלב 1: העלאת התמונה לענן ---
    image_url = upload_to_cloudinary(image_path)
    if not image_url:
        print(" ❌ Aborting alert creation due to upload failure.")
        return None

    try:
        # --- שלב 2: הכנת המידע לשרת (JSON) ---
        data = {}
        
        # הוספת הקישור מהענן
        data['imageUrl'] = image_url  # ודא שב-Schema ב-Node.js יש שדה כזה
        
        # הוספת רמת סיכון
        data['dangerLevel'] = danger_level.upper() if danger_level else 'MEDIUM'
        
        # הוספת מזהה מצלמה
        if camera_id:
            data['cameraId'] = camera_id
        
        # הוספת מיקום
        # מכיוון שאנחנו שולחים JSON, אין צורך להפוך את המילון ל-String ידנית
        if location:
            data['location'] = location # requests.post(json=...) יטפל בזה אוטומטית

        # Debug: Print what we're sending
        print(f"\n 📤 Sending Alert Data to Backend...")
        print(f"      URL: {data['imageUrl']}")
        print(f"      Danger: {data['dangerLevel']}")
        
        # --- שלב 3: שליחת הבקשה לשרת ---
        # שים לב: שינינו מ-files ל-json
        headers = {'Content-Type': 'application/json'}
        response = requests.post(API_URL, json=data, headers=headers)
        
        if response.status_code in [200, 201]:
            result = response.json()
            alert_data = result.get('data', {}) or result # תלוי במבנה התגובה שלך
            alert_id = alert_data.get('_id', 'N/A')
            
            print(f"\n ✅ Alert saved in MongoDB successfully!")
            print(f"      DB ID: {alert_id}")
            
            # אופציונלי: מחיקת הקובץ המקומי לאחר הצלחה
            # os.remove(image_path)
            # print("      🗑️  Local temp file deleted.")
            
            return alert_id
        else:
            print(f" ❌ Backend Error: {response.status_code}")
            print(f" Response: {response.text}")
            return None
            
    except Exception as e:
        print(f" ❌ Error creating alert: {str(e)}")
        return None

def main():
    parser = argparse.ArgumentParser(description='Upload image to Cloudinary and save alert in DB')
    
    parser.add_argument('--image', type=str, required=True, help='Path to image file')
    parser.add_argument('--camera-id', type=str, help='Camera ID (optional)')
    parser.add_argument('--danger-level', type=str, choices=['LOW', 'MEDIUM', 'HIGH'], help='Danger level')
    
    args = parser.parse_args()
    
    # הגדרות ברירת מחדל
    location = DEFAULT_LOCATION.copy()
    camera_id = args.camera_id if args.camera_id else DEFAULT_CAMERA_ID
    
    # הרצת הפונקציה
    create_alert(
        args.image,
        camera_id=camera_id,
        location=location,
        danger_level=args.danger_level
    )

if __name__ == '__main__':
    main()