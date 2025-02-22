import cv2
import numpy as np
import base64
import json
import requests
import os
import sys
from io import BytesIO

def store_base64(base64_string):
    """Stores base64 string in store.txt"""
    try:
        with open("store.txt", "w") as f:
            f.write(base64_string)
        print("✅ Base64 string successfully stored in store.txt")
    except Exception as e:
        print(f"❌ Error storing Base64: {str(e)}")

def decode_and_save_image(base64_string):
    """Decodes base64 image and saves it as a temporary file"""
        # Decode base64 string
    store_base64(base64_string)
    image_data = base64.b64decode(base64_string)
        
        # Convert to numpy array
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
    if image is None:
        raise ValueError("Failed to decode image")
            
        # Save the image
    temp_path = os.path.join(os.path.dirname(__file__), "temp_image.jpg")
    cv2.imwrite(temp_path, image)
    return temp_path
    print(f"Error decoding base64: {str(e)}")
    return None

def read_base64_from_file(file_path):
    """Read base64 string from file"""
    try:
        with open(file_path, 'r') as f:
            base64_string = f.read().strip()
            
        # Remove potential data URL prefix
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
            
        # Add padding if necessary
        padding = len(base64_string) % 4
        if padding:
            base64_string += '=' * (4 - padding)
            
        return base64_string
    except Exception as e:
        print(f"Error reading base64 from file: {str(e)}")
        return None

base64_string = read_base64_from_file()
temp_path = decode_and_save_image(base64_string)