import { searchSongs as ytSearchSongs } from "../providers/youtube/search.js";

export async function searchSongs(query) {
  return await ytSearchSongs(query);
}