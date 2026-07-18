import { Innertube } from "youtubei.js";

console.time("Innertube Init");

const youtube = await Innertube.create();

console.timeEnd("Innertube Init");

const searchCache = new Map();

export async function searchSongs(query) {
  const key = query.trim().toLowerCase();

  if (!key) return [];

  if (searchCache.has(key)) {
    console.log("⚡ Search Cache Hit:", key);
    return searchCache.get(key);
  }

  console.time(`Search ${key}`);

  console.time("YT Search");

const search = await youtube.search(query, {
  type: "video",
});

console.timeEnd("YT Search");

  const songs = search.results
    .filter((item) => item.type === "Video")
    .slice(0, 10)
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

  console.timeEnd(`Search ${key}`);

  return songs;
}