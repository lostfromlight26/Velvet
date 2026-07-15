import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPlaylist(folderId, name) {
  return prisma.playlist.create({
    data: {
      name,
      folderId: Number(folderId),
    },
  });
}

export async function getPlaylists(folderId) {
  return prisma.playlist.findMany({
    where: {
      folderId: Number(folderId),
    },
    include: {
      songs: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function deletePlaylist(id) {
  return prisma.playlist.delete({
    where: {
      id: Number(id),
    },
  });
}