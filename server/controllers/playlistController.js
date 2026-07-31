import {
  createPlaylist,
  getPlaylists,
  getPlaylist,
  renamePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../services/playlistService.js";
import { getFolders, createFolder } from "../services/folderService.js";

export async function createPlaylistController(req, res) {
  try {
    const { folderId, name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Playlist name is required",
      });
    }

    let targetFolderId = folderId;
    if (!targetFolderId) {
      const folders = await getFolders();
      if (folders.length > 0) {
        targetFolderId = folders[0].id;
      } else {
        const defaultFolder = await createFolder("Default");
        targetFolderId = defaultFolder.id;
      }
    }

    const playlist = await createPlaylist(targetFolderId, name.trim());

    res.status(201).json({
      success: true,
      data: playlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create playlist",
    });
  }
}

export async function getPlaylistsController(req, res) {
  try {
    const { folderId } = req.query;

    const playlists = await getPlaylists(folderId);

    res.json({
      success: true,
      data: playlists,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch playlists",
    });
  }
}

export async function getPlaylistByIdController(req, res) {
  try {
    const playlist = await getPlaylist(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    res.json({
      success: true,
      data: playlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch playlist",
    });
  }
}

export async function renamePlaylistController(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Playlist name is required",
      });
    }

    const playlist = await renamePlaylist(req.params.id, name.trim());

    res.json({
      success: true,
      data: playlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to rename playlist",
    });
  }
}

export async function addSongToPlaylistController(req, res) {
  try {
    const { youtubeId, title, artist, thumbnail, duration } = req.body;

    if (!youtubeId || !title) {
      return res.status(400).json({
        success: false,
        message: "Song details (youtubeId, title) are required",
      });
    }

    const song = await addSongToPlaylist(req.params.id, {
      youtubeId,
      title,
      artist: artist || "Unknown Artist",
      thumbnail: thumbnail || "",
      duration: duration || "0:00",
    });

    res.status(201).json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add song to playlist",
    });
  }
}

export async function removeSongFromPlaylistController(req, res) {
  try {
    const { id: playlistId, songId } = req.params;

    await removeSongFromPlaylist(playlistId, songId);

    res.json({
      success: true,
      message: "Song removed from playlist successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove song from playlist",
    });
  }
}

export async function deletePlaylistController(req, res) {
  try {
    await deletePlaylist(req.params.id);

    res.json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete playlist",
    });
  }
}