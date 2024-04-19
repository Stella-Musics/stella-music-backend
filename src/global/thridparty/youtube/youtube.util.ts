import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";

@Injectable()
export class YoutubeUtils {
  constructor(private readonly configService: ConfigService) {}

  async getVideoInfo(videoId: string) {
    const youtube = google.youtube({
      version: "v3",
      auth: this.configService.get<string>("YOUTUBE_SECRET_KEY")
    });

    const response = youtube.videos.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: [videoId]
    });

    console.log((await response).data.items);
  }
}
