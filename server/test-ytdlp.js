import ytdlp from "yt-dlp-exec";

async function test() {
  try {
    const result = await ytdlp(
      "ytsearch1:believer imagine dragons",
      {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        preferFreeFormats: true,
        skipDownload: true,
      }
    );

    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

test();