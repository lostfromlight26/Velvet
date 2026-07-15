import {
  createFolder,
  getFolders,
  deleteFolder,
} from "../services/folderService.js";

export async function createFolderController(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    const folder = await createFolder(name.trim());

    res.status(201).json({
      success: true,
      data: folder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create folder",
    });
  }
}

export async function getFoldersController(req, res) {
  try {
    const folders = await getFolders();

    res.json({
      success: true,
      data: folders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch folders",
    });
  }
}

export async function deleteFolderController(req, res) {
  try {
    await deleteFolder(req.params.id);

    res.json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete folder",
    });
  }
}