import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Icon } from "./icon";
import { ipcClient } from "./ipc";
import { ReactQueryProvidersCustom } from "./react-query-provider-custom";
import {
  VideoInfo,
  getThumbnailUrl,
  getVideoInfoFetchArgs,
  parseVideoId,
  parseVideoInfo,
} from "./youtube-utils";

export function Root() {
  return (
    <>
      <ReactQueryProvidersCustom>
        <App />
      </ReactQueryProvidersCustom>
      <Toaster />
    </>
  );
}

function App() {
  const form = useForm({ defaultValues: { videoId: "" } });
  const [videoInfo, setVideoInfo] = React.useState<VideoInfo>();

  const videoInfoMutation = useMutation(fetchVideoInfo, {
    onSuccess: (info) => {
      setVideoInfo(info);
    },
    onError: (e: any) => {
      toast.error("failed to load video info:\n" + e.toString());
    },
  });

  return (
    <div className="flex flex-col gap-2 p-3">
      <form
        className="flex flex-col"
        onSubmit={form.handleSubmit(async (data) => {
          const videoId = parseVideoId(data.videoId.trim());
          if (!videoId) {
            toast.error("invalid videoId");
            return;
          }
          videoInfoMutation.mutate(videoId);
        })}
      >
        <input
          type="text"
          className="border border-gray-200 px-1"
          placeholder="Enter Video ID or URL"
          {...form.register("videoId")}
        />
      </form>
      {videoInfo && (
        <>
          <VideoComponent
            id={videoInfo.id}
            title={videoInfo.title}
            author={videoInfo.artist ?? videoInfo.uploader}
          />
          <table className="table w-full border bg-white text-sm text-left">
            <thead>
              <tr className="uppercase">
                <th></th>
                <th>Extension</th>
                <th>File size</th>
                <th>Resolution</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {videoInfo.formats.map((f) => (
                <tr key={f.url + f.format_id}>
                  <td>
                    <a href={f.url} target="_blank">
                      <Icon name="System/download-2-line" className="w-4 h-4" />
                    </a>
                  </td>
                  <td>
                    {
                      <span className={f.ext === "m4a" ? "text-gray-400" : ""}>
                        {f.ext}
                      </span>
                    }
                  </td>
                  <td>
                    {f.filesize ? (
                      formatBytes(f.filesize)
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td>
                    {f.width && f.height && `${f.width}x${f.height}`}
                    {f.acodec === "none" && " (no audio)"}
                    {f.vcodec === "none" && " (no video)"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

async function fetchVideoInfo(videoId: string): Promise<VideoInfo> {
  const res = await ipcClient.invokeIpc("fetch-proxy", {
    fetchArgs: getVideoInfoFetchArgs(videoId),
  });
  return parseVideoInfo(JSON.parse(res.data));
}

// cf. https://github.com/hi-ogawa/ytsub-v3/blob/f55c6bbffddb468e98030f7e28d460bbf9cec6ce/app/components/misc.tsx#L19
function VideoComponent(props: { id: string; title: string; author: string }) {
  const { id, title, author } = props;

  /*
    Layout

    <- 16 -> <--- 20 --->
    ↑        ↑
    9 (cover)|
    ↓        ↓
   */

  return (
    <div
      className="relative w-full flex border bg-white"
      style={{ aspectRatio: "36 / 9" }}
    >
      <div className="flex-none w-[44%] relative aspect-video overflow-hidden">
        <div className="w-full h-full">
          <img
            className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"
            src={getThumbnailUrl(id)}
          />
        </div>
      </div>
      <div className="grow p-2 flex flex-col relative text-sm">
        <div className="line-clamp-2 mb-2">{title}</div>
        <div className="line-clamp-1 text-gray-600 text-xs pr-8">{author}</div>
      </div>
    </div>
  );
}

const BYTE_UNITS: [number, string][] = [
  [10 ** 9, "GB"],
  [10 ** 6, "MB"],
  [10 ** 3, "KB"],
];

function formatBytes(x: number): string {
  for (const [scale, suffix] of BYTE_UNITS) {
    if (x >= scale) {
      return (x / scale).toPrecision(3) + suffix;
    }
  }
  return String(x) + "B";
}
