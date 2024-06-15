import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { VideoInfoDto } from "./dto/video-info.dto";
import { ArrayUtil } from "src/global/util/array.util";

@Injectable()
export class YoutubeUtils {
  constructor(private readonly configService: ConfigService) {}

  async getVideoInfos(videoIdList: string[]): Promise<VideoInfoDto[]> {
    const youtube = google.youtube({
      version: "v3",
      auth: this.configService.get<string>("YOUTUBE_SECRET_KEY")
    });
    const videoInfoList: VideoInfoDto[] = [];

    const chunckedVideoIdList = await ArrayUtil.chunkArray(videoIdList, 50);

    const fetchVideoInfoPromises = chunckedVideoIdList.map(async (videoIdList) => {
      const response = await youtube.videos.list({
        part: ["snippet,contentDetails,statistics"],
        id: videoIdList
      });

      const videoList = response.data.items;
      if (videoList == null) throw new Error("영상 정보를 가져올 수 없음");

      const videoInfos = videoList.map((video) => ({
        videoId: video.id ?? "",
        title: video.snippet?.title ?? "",
        viewCount: +(video.statistics?.viewCount ?? 0),
        uploadedDate: new Date(video.snippet?.publishedAt ?? "")
      }));

      videoInfoList.push(...videoInfos);
    });

    await Promise.all(fetchVideoInfoPromises);

    return videoInfoList;
  }
}
