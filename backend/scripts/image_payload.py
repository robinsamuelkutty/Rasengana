import cv2
import numpy as np
import base64
import json
import requests
import os
import sys

def read_base64_from_file(file_path):
    """Read and sanitize base64 string from file"""
    try:
        with open(file_path, 'r') as f:
            base64_string = f.read().strip()
            
        # Remove any non-base64 characters (e.g., newlines, spaces)
        base64_string = ''.join([c for c in base64_string if c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='])
        
        # Add proper padding if necessary
        padding = len(base64_string) % 4
        if padding:
            base64_string += '=' * (4 - padding)
            
        return base64_string
    except Exception as e:
        print(f"Error reading base64 from file: {str(e)}")
        return None

def decode_and_save_image(base64_string):
    """Decodes base64 image and saves it as a temporary file"""
    try:
        # Validate base64 string
        if not base64_string:
            raise ValueError("Empty base64 string")
            
        # Decode base64 string
        image_data = base64.b64decode(base64_string, validate=True)
        
        # Convert to numpy array
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise ValueError("Failed to decode image")
            
        # Save the image
        temp_path = os.path.join(os.path.dirname(__file__), "temp_image.jpg")
        cv2.imwrite(temp_path, image)
        return temp_path
    except Exception as e:
        print(f"Error decoding base64: {str(e)}")
        return None

def invoke(input_file_path):
    """Calls the external API with the processed image"""
    try:
        # Read base64 string from file
        base64_string = read_base64_from_file(input_file_path)
        if not base64_string:
            return "Error: Could not read base64 from file"

        # First save the incoming image
        temp_path = decode_and_save_image(base64_string)
        if not temp_path:
            return "Error: Could not decode image"

        # Prepare API request
        url = "http://192.168.35.1:8000/validate_body"
        payload = {
            "body": json.dumps({
                "image_data": base64_string  # Send the original base64 string
            })
        }
        
        headers = {
            "Content-Type": "application/json"
        }

        # Make API request
        response = requests.post(url, headers=headers, json=payload)
        
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        if response.status_code == 200:
            result = response.json()
            return result.get("body", "Unknown")
        else:
            return f"Error: API request failed with status {response.status_code}"

    except Exception as e:
        print(f"Error in invoke: {str(e)}")
        return f"Error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No input file path provided")
        sys.exit(1)
        
    try:
        input_file_path = sys.argv[1]
        result = invoke(input_file_path)
        print(result)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)