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
    let pariticipantList: Participant[];
    switch (sortBy) {
      case SortBy.UPLOAD:
        pariticipantList = await this.participantRepository
          .createQueryBuilder("participant")
          .leftJoinAndSelect("participant.music", "music")
          .leftJoinAndSelect("participant.artist", "artist")
          .select(["participant", "music", "artist"])
          .orderBy("music.uploadedDate", "DESC")
          .getMany();
        break;
      case SortBy.OLDER:
        pariticipantList = await this.participantRepository
          .createQueryBuilder("participant")
          .leftJoinAndSelect("participant.music", "music")
          .leftJoinAndSelect("participant.artist", "artist")
          .select(["participant", "music", "artist"])
          .orderBy("music.uploadedDate", "ASC")
          .getMany();
        break;
      case SortBy.VIEWS:
        pariticipantList = await this.participantRepository
          .createQueryBuilder("participant")
          .leftJoinAndSelect("participant.music", "music")
          .leftJoinAndSelect("participant.artist", "artist")
          .select(["participant", "music", "artist"])
          .orderBy("music.views", "DESC")
          .getMany();
        break;
      default:
        throw new HttpException("sorting filter is not valid", 400);
    }

    const musicResponseList = await this.transformParticipantsToMusicResponse(pariticipantList);

    return new MusicListResponse(musicResponseList);
  }

  async getMusicChart(chartBy: ChartBy): Promise<MusicChartListResponse> {
    if (chartBy != ChartBy.TOTAL) {
      const chartList = await this.getChartUtil.getChart(chartBy);
      return new MusicChartListResponse(chartList);
    }
    const musicList = await this.musicRepository.find({ order: { views: "DESC" } });
    const musicChartResponseList = await Promise.all(
      musicList.map(async (music, index) => {
        const pariticipantList = await this.participantRepository.find({
          where: { music },
          relations: ["artist"]
        });
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

  private async transformParticipantsToMusicResponse(
    participants: Participant[]
  ): Promise<MusicResponse[]> {
    const musicMap: { [key: string]: MusicResponse } = {};

    participants.forEach((participant) => {
      const music = participant.music;
      const artist = participant.artist;

      if (!musicMap[music.id]) {
        musicMap[music.id] = new MusicResponse(
          music.id,
          music.name,
          music.youtubeId,
          music.views,
          music.uploadedDate,
          music.TJKaraokeCode,
          music.KYKaraokeCode,
          []
        );
      }

      musicMap[music.id].participantInfos.push(new ParticipantInfo(artist.id, artist.name));
    });

    return Object.values(musicMap);
  }
}
