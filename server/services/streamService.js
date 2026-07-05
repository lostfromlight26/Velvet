import ytdlp from "yt-dlp-exec";

export async function getAudioStream(videoId) {
  const result = await ytdlp(
    `https://www.youtube.com/watch?v=${videoId}`,
    {
      getUrl: true,
      format: "bestaudio",
      noWarnings: true,
      noCallHome: true,
    }
  );

  return result.trim();
}