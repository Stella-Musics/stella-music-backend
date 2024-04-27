import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { VideoInfoDto } from "./dto/video-info.dto";

@Injectable()
export class YoutubeUtils {
  constructor(private readonly configService: ConfigService) {}

  async getVideoInfos(videoIdList: string[]): Promise<VideoInfoDto[]> {
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

    const videoInfoList: VideoInfoDto[] = videoList.map((video) => {
      return {
        videoId: video.id ?? "",
        title: video.snippet?.title ?? "",
        viewCount: +(video.statistics?.viewCount ?? 0),
        uploadedDate: new Date(video.snippet?.publishedAt ?? "")
      };
    });

    return videoInfoList;
  }
}
