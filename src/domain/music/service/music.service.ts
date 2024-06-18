import { HttpException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Music } from "../entity/music.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicResponse } from "../data/response/music.response";
import { MusicListResponse } from "../data/response/music-list.response";

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>
  ) {}

  async getMusic(sortBy: string): Promise<MusicListResponse> {
    let musicList: Music[];
    switch (sortBy) {
      case "UPLOAD":
        musicList = await this.musicRepository.find({
          order: {
            uploadedDate: "DESC"
          }
        });
        break;
      case "OLDER":
        musicList = await this.musicRepository.find({
          order: {
            uploadedDate: "ASC"
          }
        });
        break;
      case "VIEWS":
        musicList = await this.musicRepository.find({
          order: {
            views: "DESC"
          }
        });
        break;
      default:
        throw new HttpException("sorting filter is not valid", 400);
    }

    const musicResponseList = await Promise.all(
      musicList.map(async (music) => {
        return new MusicResponse(
          music.id,
          music.name,
          music.youtubeId,
          music.views,
          music.uploadedDate,
          music.TJKaraokeCode,
          music.KYKaraokeCode
        );
      })
    );

    return new MusicListResponse(musicResponseList);
  }
}
