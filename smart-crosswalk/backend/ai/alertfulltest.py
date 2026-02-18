"""
Upload image as raw binary to backend and create alert in MongoDB.
No Cloudinary - image is stored directly in MongoDB.

Usage:
    python alertfulltest.py --image path/to/image.jpg --danger-level HIGH
    python alertfulltest.py --image path/to/image.jpg --camera-id <id>
"""

import os
import sys
import argparse
import json
import requests

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
except ImportError:
    pass

API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:3000/api/alerts')

DEFAULT_LOCATION = {
    'city': 'Tel Aviv',
    'street': 'Dizengoff',
    'number': '50'
}
DEFAULT_CAMERA_ID = '69617b55eb7ffca4f1000bb5'


def get_content_type(path):
    """Guess content type from file extension."""
    ext = os.path.splitext(path)[1].lower()
    return {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }.get(ext, 'image/jpeg')


def create_alert(image_path, camera_id=None, location=None, danger_level=None):
    """
    Create an alert in MongoDB by sending the image as raw binary (multipart).
    """
    if not os.path.exists(image_path):
        print(f" ❌ Error: Image file not found: {image_path}")
        return None

    try:
        data = {
            'dangerLevel': (danger_level or 'MEDIUM').upper(),
            'location': json.dumps(location) if isinstance(location, dict) else location
        }
        if camera_id:
            data['cameraId'] = camera_id

        print(f"\n 📤 Sending image as binary to Backend...")
        print(f"      Image: {os.path.basename(image_path)}")
        print(f"      Danger: {data['dangerLevel']}")

        with open(image_path, 'rb') as img_file:
            files = {
                'image': (os.path.basename(image_path), img_file, get_content_type(image_path))
            }
            response = requests.post(API_URL, files=files, data=data)

        if response.status_code in [200, 201]:
            result = response.json()
            alert_data = result.get('data', {}) or result
            alert_id = alert_data.get('_id', 'N/A')

            print(f"\n ✅ Alert saved in MongoDB successfully!")
            print(f"      DB ID: {alert_id}")
            return alert_id
        else:
            print(f" ❌ Backend Error: {response.status_code}")
            print(f" Response: {response.text}")
            return None

    except Exception as e:
        print(f" ❌ Error creating alert: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


def main():
    parser = argparse.ArgumentParser(
        description='Upload image as binary and create alert in MongoDB (no Cloudinary)'
    )
    parser.add_argument('--image', type=str, required=True, help='Path to image file')
    parser.add_argument('--camera-id', type=str, help='Camera ID (optional)')
    parser.add_argument('--danger-level', type=str, choices=['LOW', 'MEDIUM', 'HIGH'], help='Danger level')

    args = parser.parse_args()

    location = DEFAULT_LOCATION.copy()
    camera_id = args.camera_id or DEFAULT_CAMERA_ID

    create_alert(
        args.image,
        camera_id=camera_id,
        location=location,
        danger_level=args.danger_level
    )


if __name__ == '__main__':
    main()
