import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [videoId, setVideoId] = useState(null);

  const downloadReel = async () => {
    setStatus("Downloading...");
    setVideoId(null);

    const res = await fetch("http://localhost:8000/download", {
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
      <h1>Instagram Reel Downloader</h1>

      <input
        placeholder="Paste Instagram reel link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={downloadReel}>Download</button>

      <p>{status}</p>

      {videoId && (
        <a
          href={`http://localhost:8000/video/${videoId}`}
          download
        >
          ⬇️ Download Video
        </a>
      )}
    </div>
  );
}

export default App;
