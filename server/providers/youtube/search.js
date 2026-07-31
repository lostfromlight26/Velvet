import { Innertube } from "youtubei.js";

let youtubeInstance = null;

async function getYoutube() {
  if (!youtubeInstance) {
    youtubeInstance = await Innertube.create();
  }
  return youtubeInstance;
}

const searchCache = new Map();

export async function searchSongs(query) {
  const key = query.trim().toLowerCase();
  if (!key) return [];

  if (searchCache.has(key)) {
    console.log("⚡ Search Cache Hit:", key);
    return searchCache.get(key);
  }

  try {
    const yt = await getYoutube();
    const search = await yt.search(query, { type: "video" });

    const songs = (search.results || [])
      .filter((item) => item.type === "Video")
      .slice(0, 12)
      .map((video) => ({
        id: video.id,
        title: video.title?.text ?? "Unknown Title",
        artist:
          video.author?.name ??
          video.author?.text ??
          "Unknown Artist",
        duration:
          video.duration?.text ??
          video.duration?.simple_text ??
          "--:--",
        thumbnail:
          video.thumbnails?.[video.thumbnails.length - 1]?.url ?? "",
      }));

    searchCache.set(key, songs);
    return songs;
  } catch (err) {
    console.error("Innertube search error:", err);
    return [];
  }
}