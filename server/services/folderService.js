import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createFolder(name) {
  return prisma.folder.create({
    data: {
      name,
    },
  });
}

export async function getFolders() {
  return prisma.folder.findMany({
    include: {
      playlists: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function deleteFolder(id) {
  return prisma.folder.delete({
    where: {
      id: Number(id),
    },
  });
}