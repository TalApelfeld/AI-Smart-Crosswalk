import os
from ultralytics import YOLO
import cv2

# 1.load the model
model = YOLO('yolov8n-pose.pt')

# 2.setup data
script_dir = os.path.dirname(os.path.abspath(__file__))
input_folder = os.path.join(script_dir, 'mocks_img')
output_folder = os.path.join(script_dir, 'mocks_img_output')

#3. procees the folder
print(f"Processing folder: {input_folder}")

for filename in os.listdir(input_folder):
    if filename.endswith(('.jpg', '.jpeg', '.png')):
        img_path = os.path.join(input_folder, filename)

#4. predict the folder and save the results
        results = model.predict(source=img_path)
        for r in results:       
            im_array = r.plot(kpt_radius=1, line_width=1) 
            output_path = os.path.join(output_folder, filename)
            cv2.imwrite(output_path, im_array)
   
print(f"Processed {filename}")

print("All images processed successfully")
