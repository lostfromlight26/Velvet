import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPlaylist(folderId, name) {
  return prisma.playlist.create({
    data: {
      name,
      folderId: Number(folderId),
    },
    include: {
      songs: true,
    },
  });
}

export async function getPlaylists(folderId) {
  const where = folderId ? { folderId: Number(folderId) } : {};

  return prisma.playlist.findMany({
    where,
    include: {
      songs: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getPlaylist(id) {
  return prisma.playlist.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      songs: true,
    },
  });
}

export async function renamePlaylist(id, name) {
  return prisma.playlist.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
    },
    include: {
      songs: true,
    },
  });
}

export async function addSongToPlaylist(id, song) {
  return prisma.playlistSong.create({
    data: {
      playlistId: Number(id),
      youtubeId: song.youtubeId,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      duration: song.duration,
    },
  });
}

export async function removeSongFromPlaylist(
  playlistId,
  songId
) {
  return prisma.playlistSong.deleteMany({
    where: {
      playlistId: Number(playlistId),
      youtubeId: songId,
    },
  });
}

export async function deletePlaylist(id) {
  await prisma.playlistSong.deleteMany({
    where: {
      playlistId: Number(id),
    },
  });

  return prisma.playlist.delete({
    where: {
      id: Number(id),
    },
  });
}