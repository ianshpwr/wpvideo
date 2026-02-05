import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [videoId, setVideoId] = useState(null);

  const downloadReel = async () => {
    setStatus("Downloading...");
    setVideoId(null);

    const res = await fetch("https://wpvideo.onrender.com/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.detail || "Error");
      return;
    }

    setVideoId(data.video_id);
    setStatus("Ready");
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">
          <span className="gradient-text">Insta Reel</span> Downloader
        </h1>
        <p className="subtitle">Download your favorite reels in high quality</p>

        <div className="input-group">
          <input
            className="url-input"
            placeholder="Paste Instagram reel link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="download-btn" onClick={downloadReel} disabled={status === "Downloading..."}>
            {status === "Downloading..." ? "..." : "Download"}
          </button>
        </div>

        {status && status !== "Ready" && status !== "Downloading..." && (
          <p className="status-message error">{status}</p>
        )}

        {videoId && (
          <div className="success-container">
            <a
              href={`https://wpvideo.onrender.com/video/${videoId}`}
              className="download-link"
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              ⬇️ Download Video
            </a>
            <p className="status-ready">Your video is ready!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
