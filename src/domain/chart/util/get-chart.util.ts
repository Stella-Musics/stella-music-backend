import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChartOfDay } from "../entity/chart-of-day.entity";
import { ChartOfYear } from "../entity/chart-of-year.entity";
import { Repository } from "typeorm";
import { ChartOfHour } from "../entity/chart-of-hour.entity";
import { ChartOfMonth } from "../entity/chart-of-month.entity";
import { ChartOfWeek } from "../entity/chart-of-week.entity";
// import { BaseChartEntity } from "../entity/base/base-chart.entity";
import { ChartBy } from "src/domain/music/enum/chart-by.enum";

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

  async getChart(
    chartBy: ChartBy
  ): Promise<ChartOfDay[] | ChartOfHour[] | ChartOfYear[] | ChartOfMonth[] | ChartOfWeek[]> {
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

    const chartRepository = repositoryMap[chartBy];
    const chartList = await chartRepository.find({
      relations: ["music"],
      order: { views: "DESC" }
    });

    return chartList;
  }
}
