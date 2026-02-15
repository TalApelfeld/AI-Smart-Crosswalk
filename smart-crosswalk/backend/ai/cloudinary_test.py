import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
load_dotenv()

# תעתיק את הפרטים האלו מה-Dashboard ב-Cloudinary
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)

def test_upload():
    try:
        # כאן תשים נתיב לאחת מתמונות המוק שיש לך בתיקיית mocks_img
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        image_path = os.path.join(script_dir, "mocks_img_output", "bus.jpg")
        
        print("Uploading to Cloudinary...")
        response = cloudinary.uploader.upload(image_path)
        
        print("Success! Image URL:")
        print(response["secure_url"])
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_upload()