import json
from fastapi import FastAPI
from pydantic import BaseModel, field_validator
from process.inference import input_fn

app = FastAPI()

def log_response_to_file(response_data):
    with open("C:/Users/USER/Desktop/Project/AI/Yolo/Sign/API/response.txt", "w") as file:  # Open in append mode
        file.write(json.dumps(response_data, indent=4) + "\n\n")

class RequestModel(BaseModel):
    body: str

    @field_validator("body")
    @classmethod
    def validate_format(cls, v):
        prefix = "{\"image_data\": \""
        suffix = "\"}"
        if not (v.startswith(prefix) and v.endswith(suffix)):
            raise ValueError(f'The "body" field must start with {prefix} and end with {suffix}')

        return v  # If valid, return the same value



@app.post("/validate_body")
async def validate_body(request: RequestModel):
    prefix_len = len("{\"image_data\": \"")  # Length of the starting format
    payload = request.body[prefix_len:-2]  # Extract only the inner content
    result=input_fn(payload)
    return result


@app.get("/")
def read_root():
    return {"Hello": "World"}
