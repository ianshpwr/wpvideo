from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import uuid
import os

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

@app.post("/download")
def download_video(data: dict):
    url = data.get("url")

    if not url or "instagram.com" not in url:
        raise HTTPException(status_code=400, detail="Invalid Instagram URL")

    video_id = str(uuid.uuid4())
    filepath = f"{DOWNLOAD_DIR}/{video_id}.mp4"

    ydl_opts = {
        "outtmpl": filepath,
        "format": "mp4",
        "quiet": True
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except Exception:
        raise HTTPException(status_code=500, detail="Download failed")

    return {"video_id": video_id}

@app.get("/video/{video_id}")
def get_video(video_id: str, background_tasks: BackgroundTasks):
    filepath = f"{DOWNLOAD_DIR}/{video_id}.mp4"

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")

    background_tasks.add_task(os.remove, filepath)

    return FileResponse(
        filepath,
        media_type="video/mp4",
        filename="reel.mp4"
    )