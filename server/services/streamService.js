import { getAudioStream as ytGetAudioStream } from "../providers/youtube/stream.js";

export async function getAudioStream(videoId) {
  return await ytGetAudioStream(videoId);
}