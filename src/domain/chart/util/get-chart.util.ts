import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChartOfDay } from "../entity/chart-of-day.entity";
import { ChartOfYear } from "../entity/chart-of-year.entity";
import { Repository } from "typeorm";
import { ChartOfHour } from "../entity/chart-of-hour.entity";
import { ChartOfMonth } from "../entity/chart-of-month.entity";
import { ChartOfWeek } from "../entity/chart-of-week.entity";
import { ChartBy } from "src/domain/music/enum/chart-by.enum";
import { Participant } from "src/domain/participant/entity/participant.entity";
import { Artist } from "src/domain/artist/entity/artist.entity";
import { MusicChartResponse } from "src/domain/music/data/response/music-chart.response";
import { ParticipantInfo } from "src/domain/participant/data/response/participant-info.response";

@Injectable()
export class GetChartUtil {
  constructor(
    @InjectRepository(ChartOfDay)
    private readonly chartOfDayRepository: Repository<ChartOfDay>,
    @InjectRepository(ChartOfYear)
    private readonly chartOfYearRepository: Repository<ChartOfYear>,
    @InjectRepository(ChartOfHour)
    private readonly chartOfHourRepository: Repository<ChartOfHour>,
    @InjectRepository(ChartOfMonth)
    private readonly chartOfMonthRepository: Repository<ChartOfMonth>,
    @InjectRepository(ChartOfWeek)
    private readonly chartOfWeekRepository: Repository<ChartOfWeek>
  ) {}

  async getChart(chartBy: ChartBy): Promise<MusicChartResponse[]> {
    const repositoryMap: {
      [key: string]: Repository<
        ChartOfDay | ChartOfHour | ChartOfYear | ChartOfMonth | ChartOfWeek
      >;
    } = {
      HOUR: this.chartOfDayRepository,
      DAY: this.chartOfHourRepository,
      WEEK: this.chartOfMonthRepository,
      MONTH: this.chartOfWeekRepository,
      YEAR: this.chartOfYearRepository
    };
    const chartTypeMap = {
      [ChartBy.HOUR]: "chart_of_hour",
      [ChartBy.DAY]: "chart_of_day",
      [ChartBy.WEEK]: "chart_of_week",
      [ChartBy.MONTH]: "chart_of_month",
      [ChartBy.YEAR]: "chart_of_year"
    };
    const chartType = chartTypeMap[chartBy];

    const chartRepository = repositoryMap[chartBy];
    const rawResult = await chartRepository
      .createQueryBuilder(chartType)
      .leftJoinAndSelect(`${chartType}.music`, "music")
      .leftJoin(Participant, "participant", "participant.musicId = music.id")
      .leftJoin(Artist, "artist", "participant.artistId = artist.id")
      .select([`${chartType}.*`, "music", "artist.id", "artist.name"])
      .orderBy("music.views", "DESC")
      .getRawMany();

    const chartMap = new Map<string, MusicChartResponse>();

    rawResult.map((result) => {
      const participantInfo = new ParticipantInfo(result.artist_id, result.artist_name);
      if (chartMap.has(result.music_id)) {
        chartMap.get(result.music_id)?.participantInfos.push(participantInfo);
      } else {
        const musicChartResponse = new MusicChartResponse(
          result.music_id,
          result.music_name,
          result.music_youtubeId,
          result.music_views,
          result.uploadedDate,
          result.music_TJKaraokeCode,
          result.music_KYKaraokeCode,
          result.rise,
          result.ranking,
          [participantInfo]
        );
        chartMap.set(result.music_id, musicChartResponse);
      }
    });

    return Array.from(chartMap.values());
  }
}
