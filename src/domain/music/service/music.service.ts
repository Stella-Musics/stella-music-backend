import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Music } from "../entity/music.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicResponse } from "../data/response/music.response";
import { MusicListResponse } from "../data/response/music-list.response";
import { SortBy } from "../enum/sort-by.enum";
import { ParticipantInfo } from "src/domain/participant/data/response/participant-info.response";
import { ChartBy } from "../enum/chart-by.enum";
import { GetChartUtil } from "src/domain/chart/util/get-chart.util";
import { MusicChartListResponse } from "../data/response/music-chart-list.response";
import { MusicChartResponse } from "../data/response/music-chart.response";
import { ChartOfDay } from "src/domain/chart/entity/chart-of-day.entity";
import { Artist } from "src/domain/artist/entity/artist.entity";

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ChartOfDay)
    private readonly chartOfDayRepository: Repository<ChartOfDay>,
    private readonly getChartUtil: GetChartUtil,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>
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

  async getNewestMusic(): Promise<MusicListResponse> {
    const musicList = await this.musicRepository.find({
      relations: ["participants", "participants.artist"],
      order: { uploadedDate: "DESC" },
      take: 5
    });

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

  async getPopularMusic(): Promise<MusicListResponse> {
    const chartList = await this.chartOfDayRepository.find({
      relations: ["music", "music.participants", "music.participants.artist"],
      order: { rise: "DESC", views: "DESC" },
      take: 5
    });

    const musicList = chartList.map((chart) => {
      return chart.music;
    });

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

  async getMusicByArtist(artistId: number): Promise<MusicListResponse> {
    const artist = await this.artistRepository.existsBy({
      id: artistId
    });
    if (artist === false)
      throw new HttpException("해당 아티스트를 찾을 수 없음", HttpStatus.NOT_FOUND);

    const musicList = await this.musicRepository
      .createQueryBuilder("music")
      .leftJoinAndSelect("music.participants", "participant")
      .leftJoinAndSelect("participant.artist", "artist")
      .where("artist.id = :artistId", { artistId })
      .getMany();

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
}
