import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChartOfDay } from "../entity/chart-of-day.entity";
import { ChartOfYear } from "../entity/chart-of-year.entity";
import { FindOptionsOrder, Repository } from "typeorm";
import { ChartOfHour } from "../entity/chart-of-hour.entity";
import { ChartOfMonth } from "../entity/chart-of-month.entity";
import { ChartOfWeek } from "../entity/chart-of-week.entity";
import { ChartBy } from "src/domain/music/enum/chart-by.enum";
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

  async getChart<T extends ChartOfDay | ChartOfHour | ChartOfYear | ChartOfMonth | ChartOfWeek>(
    chartBy: ChartBy
  ): Promise<MusicChartResponse[]> {
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

    const chartRepository = repositoryMap[chartBy] as Repository<T>;
    const rawResult = await chartRepository.find({
      relations: ["music", "music.participants", "music.participants.artist"],
      order: { ranking: "ASC" } as FindOptionsOrder<T>
    });

    const chartResponseList = rawResult.map((result) => {
      const participantInfos = result.music.participants.map((participant) => {
        return new ParticipantInfo(participant.artist.id, participant.artist.name);
      });
      const musicChartResponse = new MusicChartResponse(
        result.music.id,
        result.music.name,
        result.music.youtubeId,
        result.music.views,
        result.music.uploadedDate,
        result.music.TJKaraokeCode,
        result.music.KYKaraokeCode,
        result.rise,
        result.ranking,
        participantInfos
      );
      return musicChartResponse;
    });

    return chartResponseList;
  }
}
