import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function addFavorite(song) {
  return prisma.favorite.upsert({
    where: {
      youtubeId: song.youtubeId,
    },
    update: {},
    create: {
      youtubeId: song.youtubeId,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      duration: song.duration,
    },
  });
}

export async function removeFavorite(youtubeId) {
  return prisma.favorite.delete({
    where: {
      youtubeId,
    },
  });
}

export async function getFavorites() {
  return prisma.favorite.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}