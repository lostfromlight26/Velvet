import { getAudioStream } from "../services/streamService.js";

export async function stream(req, res) {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Video ID is required",
      });
    }

    const url = await getAudioStream(videoId);

    res.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("Stream Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get audio stream",
    });
  }
}