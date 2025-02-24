
# **Rasengana**

Rasengana is a user-interactive ASL (American Sign Language) learning platform designed for children who are challenged, mute, or beginners in ASL. It helps users learn ASL alphabets by analyzing their gestures using AI and providing real-time feedback. To enhance proficiency, Rasangane also includes interactive games.

## Features

* **AI-Powered Gesture Recognition:** Uses YOLO to analyze and validate ASL gestures.
* **Real-Time Feedback:** Guides users on correct or incorrect gestures.
* **Interactive Games:** Engaging activities to improve ASL learning.
* **Modern Technology Stack:** Built with React, FastAPI, AWS SageMaker, and Python for a seamless experience.

## Tech Stack
* **Frontend:** React JS + TS
* **Backend:** FastAPI for LAN API
* **AI Model:** YOLOv8nano for ASL Recognition
* **Cloud Service:** AWS SageMaker for Model deployement,AWS Lambda and AWS API Gateway for WAN API
* **Programming Languages:** Python,

## Installation
* ## *Prequisites*
  - Python >= 3.10
  - Node >= v22.12.0

* ## Clone Repository:
  - open Terminal
  ```bash
  git clone https://github.com/robinsamuelkutty/Rasengana.git
  ```
  - navigate to API directory
    ```bash
    cd Rasengana
    cd API
    python --version
    ```
  - If your python version < 3.10 then install [Python 3.10](https://www.python.org/downloads/release/python-3100/)
  - navigate to the API folder in cmd
  - ```bash
    python -m venv venv #creates a vitual enviornment for API
    venv/Scripts/activate #activate the virtual enviornment
    ```
  - Setting up the venv
    ```bash
    pip install -r requirements.txt
    ```
  - Activate the server
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8023 --reload
    ```
  - Open PowerShell
    ```bash
    ipconfig     #for windows
    ```
  - copy your Ipv4 address `192.168._._` and replace it with the ip given by router in the link `0.0.0.0`      
      
  #### Setting up WEB app ####
  - open terminal and navigate to Backend
    ```bash
    cd backend
    npm install
    npm start
    ```
  - open another terminal window and navigate to Frontend
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
## API Reference

#### Get all items

```http
  GET /
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `/` | `string` | API |

#### Get item

```http
  POST /validate_body
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `/validate_body`      | `{"body":"{\"image_data\":\"Base64Encoded image in string"}"}` | **Required**. API |



For further info about the API key you can access the documentation by using `/docs` with api key



