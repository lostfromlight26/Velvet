import ytdlp from "yt-dlp-exec";

export async function searchSongs(query) {
  const result = await ytdlp(`ytsearch10:${query}`, {
    dumpSingleJson: true,
    skipDownload: true,
    noWarnings: true,
    noCallHome: true,
    preferFreeFormats: true,
  });

  return result.entries.map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.channel || song.uploader || "Unknown Artist",
    duration: song.duration_string,
    thumbnail: song.thumbnail,
  }));
}