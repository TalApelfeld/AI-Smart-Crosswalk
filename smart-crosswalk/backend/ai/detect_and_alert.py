"""
Script to upload image and create alert in MongoDB
Input: Picture, Camera ID (optional), Danger Level (optional)
Output: Alert record in database with image

Usage:
    python detect_and_alert.py --image path.jpg --camera-id <id> --danger-level HIGH
    python detect_and_alert.py --image path.jpg --camera-id <id>
    python detect_and_alert.py --image path.jpg --danger-level HIGH
"""

import os
import sys
import argparse
import json
import requests
from datetime import datetime

# Configuration
API_URL = 'http://localhost:3000/api/alerts'  # Backend API URL

# Default location values (can be modified here)
DEFAULT_LOCATION = {
    'city': 'Tel Aviv',
    'street': 'Dizengoff',
    'number': '50'
}
DEFAULT_CAMERA_ID = '69617b55eb7ffca4f1000bb5'

def create_alert(image_path, camera_id=None, location=None, danger_level=None):
    """
    Create an alert in MongoDB via API by uploading the image
    
    Args:
        image_path: Path to image file
        camera_id: Camera ID (optional)
        location: Dictionary with {city, street, number} (optional)
        danger_level: Danger level - LOW, MEDIUM, or HIGH (optional, defaults to MEDIUM)
    """
    
    if not os.path.exists(image_path):
        print(f"   ❌ Error: Image file not found: {image_path}")
        return None
    
    try:
        # Prepare request data
        data = {}
        
        # Add danger level (default to MEDIUM if not provided)
        if danger_level:
            data['dangerLevel'] = danger_level.upper()
        else:
            data['dangerLevel'] = 'MEDIUM'  # Default
        
        # Add camera ID if provided
        if camera_id:
            data['cameraId'] = camera_id
            print(f"   📷 Camera ID: {camera_id}")
        
        # Add location if provided (send as JSON string)
        if location:
            if isinstance(location, str):
                # Already a JSON string, use as is
                data['location'] = location
            elif isinstance(location, dict):
                # Convert dict to JSON string
                data['location'] = json.dumps(location)
            print(f"   📍 Location: {data['location']}")
        
        # Prepare request with image file
        with open(image_path, 'rb') as img_file:
            files = {
                'image': (os.path.basename(image_path), img_file, 'image/jpeg')
            }
            
            # Debug: Print what we're sending
            print(f"\n   📤 Uploading image and creating alert...")
            print(f"      Image: {os.path.basename(image_path)}")
            print(f"      Data fields: {list(data.keys())}")
            if 'cameraId' in data:
                print(f"      cameraId: {data['cameraId']}")
            if 'location' in data:
                print(f"      location: {data['location']}")
            if 'dangerLevel' in data:
                print(f"      dangerLevel: {data['dangerLevel']}")
            
            # Send POST request
            response = requests.post(API_URL, files=files, data=data)
            
            if response.status_code == 201:
                result = response.json()
                alert_data = result.get('data', {})
                alert_id = alert_data.get('_id', 'N/A')
                crosswalk_id = alert_data.get('crosswalkId', None)
                
                print(f"\n   ✅ Alert created successfully!")
                print(f"      Alert ID: {alert_id}")
                print(f"      Danger Level: {alert_data.get('dangerLevel', 'N/A')}")
                print(f"      Detection Photo: {alert_data.get('detectionPhoto', {}).get('url', 'N/A')}")
                
                if crosswalk_id:
                    print(f"      ✅ Crosswalk ID: {crosswalk_id}")
                else:
                    print(f"      ⚠️  No crosswalk linked (location or cameraId may be missing)")
                
                return alert_id
            else:
                print(f"   ❌ Failed to create alert: {response.status_code}")
                print(f"   Response: {response.text}")
                return None
                
    except Exception as e:
        print(f"   ❌ Error creating alert: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def main():
    parser = argparse.ArgumentParser(
        description='Upload image and create alert in database',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Upload image with camera and danger level
  python detect_and_alert.py --image photo.jpg --camera-id 507f1f77bcf86cd799439011 --danger-level HIGH
  
  # Upload image with camera only (uses default location)
  python detect_and_alert.py --image photo.jpg --camera-id 507f1f77bcf86cd799439011
  
  # Upload image with danger level only (uses default location)
  python detect_and_alert.py --image photo.jpg --danger-level HIGH
  
  # Upload image only (uses default location)
  python detect_and_alert.py --image photo.jpg
        """
    )
    
    parser.add_argument('--image', type=str, required=True, help='Path to image file')
    parser.add_argument('--camera-id', type=str, help='Camera ID (optional)')
    parser.add_argument('--danger-level', type=str, choices=['LOW', 'MEDIUM', 'HIGH'], help='Danger level (default: MEDIUM)')
    
    args = parser.parse_args()
    
    # Validate image file
    if not os.path.exists(args.image):
        print(f"❌ Error: Image file not found: {args.image}")
        sys.exit(1)
    
    # Always use default location
    location = DEFAULT_LOCATION.copy()
    camera_id = args.camera_id if args.camera_id else DEFAULT_CAMERA_ID
    # Display input information
    print(f"📸 Uploading image: {args.image}")
    print(f"📍 Location: {location.get('city')}, {location.get('street')} {location.get('number')} (default)")
    if camera_id:
        print(f"📷 Camera ID: {camera_id}")
    if args.danger_level:
        print(f"⚠️  Danger Level: {args.danger_level}")
    else:
        print(f"⚠️  Danger Level: MEDIUM (default)")
    print()
    
    # Create alert by uploading image
    create_alert(
        args.image,
        camera_id=camera_id,
        location=location,
        danger_level=args.danger_level
    )
    
    print("\n✅ Processing complete")

if __name__ == '__main__':
    main()
