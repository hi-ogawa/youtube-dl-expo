import { z } from "zod";

// copied from https://github.com/hi-ogawa/youtube-dl-web/blob/3543030484bf6023e031c74ec1d3f29919822e1c/app/utils/youtube.ts

// https://github.com/ytdl-org/youtube-dl/blob/9aa8e5340f3d5ece372b983f8e399277ca1f1fe4/youtube_dl/extractor/youtube.py#L1958-L1986
export interface VideoInfo {
  id: string;
  title: string;
  uploader: string;
  artist?: string;
  album?: string;
  track?: string;
  formats: FormatInfo[];
}

// https://github.com/ytdl-org/youtube-dl/blob/9aa8e5340f3d5ece372b983f8e399277ca1f1fe4/youtube_dl/extractor/youtube.py#L1819-L1830
export interface FormatInfo {
  url: string;
  filesize: number | null;
  format_id: string;
  format_note: string;
  ext: string;
  acodec: string; // none, opus, mp4a.40.2, ...
  vcodec: string; // none, vp9, av01.0.00M.08, ...
  width: number | null;
  height: number | null;
}

const RAW_INFO_SCHEMA = z.object({
  videoDetails: z.object({
    videoId: z.string(),
    title: z.string(),
    author: z.string(),
  }),
  streamingData: z.object({
    // formats: z.object({}).array(), // TODO
    adaptiveFormats: z
      .object({
        itag: z.number(),
        url: z.string(),
        mimeType: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
        contentLength: z.string().refine((s) => s.match(/^\d+$/)),
      })
      .array(),
  }),
});

export function parseVideoId(value: string): string | undefined {
  if (value.length === 11) {
    return value;
  }
  if (value.match(/youtube\.com|youtu\.be/)) {
    try {
      const url = new URL(value);
      if (url.hostname === "youtu.be") {
        return url.pathname.substring(1);
      } else {
        const videoId = url.searchParams.get("v");
        if (videoId) {
          return videoId;
        }
      }
    } catch {}
  }
  return;
}

export function parseVideoInfo(data: any): VideoInfo {
  const p = RAW_INFO_SCHEMA.parse(data);
  return {
    id: p.videoDetails.videoId,
    title: p.videoDetails.title,
    uploader: p.videoDetails.author,
    formats: p.streamingData.adaptiveFormats.map((f) => ({
      url: f.url,
      filesize: Number(f.contentLength),
      format_id: f.itag.toString(),
      format_note: f.mimeType,
      ext: f.mimeType.split(";")[0]!.split("/")[1]!,
      acodec: f.mimeType.includes("audio/")
        ? f.mimeType.split(";")[1]!
        : "none",
      vcodec: f.mimeType.includes("video/")
        ? f.mimeType.split(";")[1]!
        : "none",
      width: f.width ?? null,
      height: f.height ?? null,
    })),
  };
}

// https://gist.github.com/hi-ogawa/23f6d0b212f51c2b1b255339c642e9b9
export function getVideoInfoFetchArgs(
  videoId: string
): Parameters<typeof fetch> {
  const url = "https://www.youtube.com/youtubei/v1/player";
  const body = {
    videoId,
    context: {
      client: {
        clientName: "ANDROID",
        clientVersion: "17.31.35",
        androidSdkVersion: 30,
        hl: "en",
        timeZone: "UTC",
        utcOffsetMinutes: 0,
      },
    },
  };
  return [
    url,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  ];
}

export function getThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
