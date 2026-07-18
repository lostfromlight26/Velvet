import ytdlp from "yt-dlp-exec";

const streamCache = new Map();

export async function getAudioStream(videoId) {
  if (streamCache.has(videoId)) {
    console.log("⚡ Stream Cache Hit:", videoId);
    return streamCache.get(videoId);
  }

  console.time(`Stream ${videoId}`);

  const url = await ytdlp(
    `https://www.youtube.com/watch?v=${videoId}`,
    {
      getUrl: true,
      format: "bestaudio",
      noWarnings: true,
      noCallHome: true,
    }
  );

  const streamUrl = url.trim();

  streamCache.set(videoId, streamUrl);

  console.timeEnd(`Stream ${videoId}`);

  return streamUrl;
}