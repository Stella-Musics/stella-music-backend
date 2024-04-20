import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { VideoInfoDto } from "./dto/video-info.dto";

@Injectable()
export class YoutubeUtils {
  constructor(private readonly configService: ConfigService) {}

  async getVideoInfo(videoIdList: string[]): Promise<VideoInfoDto[]> {
    const youtube = google.youtube({
      version: "v3",
      auth: this.configService.get<string>("YOUTUBE_SECRET_KEY")
    });

    const response = youtube.videos.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: videoIdList
    });

    const videoList = (await response).data.items;
    if (videoList == null) throw new Error("영상 정보를 가져올 수 없음");

    console.log(videoList);

    const videoInfoList = videoList.map((video) => {
      return new VideoInfoDto(
        video.id ?? "",
        video.snippet?.title ?? "",
        video.statistics?.viewCount ?? "",
        new Date(video.snippet?.publishedAt ?? "")
      );
    });

    return videoInfoList;
  }
}
