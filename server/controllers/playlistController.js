import {
  createPlaylist,
  getPlaylists,
  deletePlaylist,
} from "../services/playlistService.js";

export async function createPlaylistController(req, res) {
  try {
    const { folderId, name } = req.body;

    if (!folderId || !name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Folder ID and playlist name are required",
      });
    }

    const playlist = await createPlaylist(folderId, name.trim());

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

    if (!folderId) {
      return res.status(400).json({
        success: false,
        message: "folderId is required",
      });
    }

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