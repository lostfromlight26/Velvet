import { searchYoutube } from "./youtube/search.js";

export async function searchSongs(query) {
  return await searchYoutube(query);
}