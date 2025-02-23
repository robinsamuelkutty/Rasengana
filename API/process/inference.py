import numpy as np
import torch, json, base64, cv2
from ultralytics import YOLO


def input_fn(request_body):
    print("Executing input_fn from inference.py ...")
    model = YOLO("best.pt")
    jpg_original = base64.b64decode(request_body)
    jpg_as_np = np.frombuffer(jpg_original, dtype=np.uint8)
    img = cv2.imdecode(jpg_as_np, flags=-1)
    return predict_fn(img,model)


def predict_fn(input_data, model):
    print("Executing predict_fn from inference.py ...")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)

    with torch.no_grad():
        results = model(input_data)

    return output_fn(results)


# Class index to object name mapping
CLASS_NAMES = {
    0: "A", 1: "B", 2: "C", 3: "D", 4: "E", 5: "F", 6: "G", 7: "H", 8: "I",
    9: "K", 10: "L", 11: "M", 12: "N", 13: "O", 14: "P", 15: "Q", 16: "R",
    17: "S", 18: "T", 19: "U", 20: "V", 21: "W", 22: "X", 23: "Y", 24: "Z",
    25: "Space", 26: "Del", 27: "J"
}

def output_fn(prediction_output):
    print("Executing output_fn from inference.py ...")

    detected_classes = set()  # Use a set to avoid duplicates

    for result in prediction_output:
        # Handle Classification Mode
        if hasattr(result, "probs") and result.probs is not None:
            probs = result.probs.cpu().numpy()
            if probs.size > 0:
                class_idx = int(probs.argmax())  # Get highest probability class
                detected_classes.add(class_idx)

        # Handle Object Detection Mode
        if hasattr(result, "boxes") and result.boxes is not None:
            if result.boxes.cls.numel() > 0:
                class_indices = result.boxes.cls.cpu().numpy().astype(int)
                detected_classes.update(class_indices.tolist())

    # If no classes detected, return empty placeholder
    if not detected_classes:
        return json.dumps("Oops Try again")  # Return "_"

    # Convert detected class indices to corresponding object names
    detected_objects = [CLASS_NAMES[idx] for idx in detected_classes if idx in CLASS_NAMES]

    # Return the formatted string
    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        "body": json.dumps(detected_objects[0])  # Ensures it returns "\"F\"" format
    }

    return response
