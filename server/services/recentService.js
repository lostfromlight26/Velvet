import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function addRecentSong(song) {
  return prisma.recentSong.upsert({
    where: {
      youtubeId: song.youtubeId,
    },
    update: {
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      duration: song.duration,
      playedAt: new Date(),
    },
    create: {
      youtubeId: song.youtubeId,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      duration: song.duration,
    },
  });
}

export async function getRecentSongs() {
  return prisma.recentSong.findMany({
    orderBy: {
      playedAt: "desc",
    },
    take: 20,
  });
}