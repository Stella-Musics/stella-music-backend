import { HttpException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Music } from "../entity/music.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicResponse } from "../data/response/music.response";
import { MusicListResponse } from "../data/response/music-list.response";
import { SortBy } from "../enum/sort-by.enum";
import { Participant } from "src/domain/participant/entity/participant.entity";
import { ParticipantInfo } from "src/domain/participant/data/response/participant-info.response";
import { ChartBy } from "../enum/chart-by.enum";
import { GetChartUtil } from "src/domain/chart/util/get-chart.util";
import { MusicChartListResponse } from "../data/response/music-chart-list.response";
import { MusicChartResponse } from "../data/response/music-chart.response";

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    private readonly getChartUtil: GetChartUtil
  ) {}

  async getMusic(sortBy: SortBy): Promise<MusicListResponse> {
    let musicList: Music[];
    switch (sortBy) {
      case SortBy.UPLOAD:
        musicList = await this.musicRepository.find({
          relations: ["participants", "participants.artist"],
          order: { uploadedDate: "DESC" }
        });
        break;
      case SortBy.OLDER:
        musicList = await this.musicRepository.find({
          relations: ["participants", "participants.artist"],
          order: { uploadedDate: "ASC" }
        });
        break;
      case SortBy.VIEWS:
        musicList = await this.musicRepository.find({
          relations: ["participants", "participants.artist"],
          order: { views: "DESC" }
        });
        break;
      default:
        throw new HttpException("sorting filter is not valid", 400);
    }

    const musicResponseList = musicList.map((music) => {
      const participantInfos = music.participants.map((pariticipant) => {
        return new ParticipantInfo(pariticipant.artist.id, pariticipant.artist.name);
      });
      return new MusicResponse(
        music.id,
        music.name,
        music.youtubeId,
        music.views,
        music.uploadedDate,
        music.TJKaraokeCode,
        music.KYKaraokeCode,
        participantInfos
      );
    });

    return new MusicListResponse(musicResponseList);
  }

  async getMusicChart(chartBy: ChartBy): Promise<MusicChartListResponse> {
    if (chartBy != ChartBy.TOTAL) {
      const chartList = await this.getChartUtil.getChart(chartBy);
      return new MusicChartListResponse(chartList);
    }
    const musicList = await this.musicRepository.find({
      relations: ["participants", "participants.artist"],
      order: { views: "DESC" }
    });
    const musicChartResponseList = await Promise.all(
      musicList.map(async (music, index) => {
        const pariticipantList = music.participants;
        const participantInfoList = pariticipantList.map((participant) => {
          return new ParticipantInfo(participant.artist.id, participant.artist.name);
        });
        return new MusicChartResponse(
          music.id,
          music.name,
          music.youtubeId,
          music.views,
          music.uploadedDate,
          music.TJKaraokeCode,
          music.KYKaraokeCode,
          0,
          index + 1,
          participantInfoList
        );
      })
    );
    return new MusicChartListResponse(musicChartResponseList);
  }
}
