import ytdlp from "yt-dlp-exec";

const streamCache = new Map();

export async function getAudioStream(videoId) {
  if (!videoId) throw new Error("Video ID is required");

  if (streamCache.has(videoId)) {
    console.log("⚡ Stream Cache Hit:", videoId);
    return streamCache.get(videoId);
  }

  console.time(`Stream ${videoId}`);

  try {
    const url = await ytdlp(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        getUrl: true,
        format: "bestaudio",
        noWarnings: true,
        noCallHome: true,
      }
    );

    const streamUrl = (typeof url === "string" ? url : String(url)).trim();
    if (streamUrl) {
      streamCache.set(videoId, streamUrl);
    }

    console.timeEnd(`Stream ${videoId}`);
    return streamUrl;
  } catch (err) {
    console.error("Stream extraction error for video", videoId, err);
    throw err;
  }
}