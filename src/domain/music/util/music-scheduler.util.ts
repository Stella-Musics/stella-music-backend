import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChartOfDay } from "src/domain/chart/entity/chart-of-day.entity";
import { BaseViewsEntity } from "../entity/base/base-views.entity";
import { ChartOfYear } from "src/domain/chart/entity/chart-of-year.entity";
import { ChartOfHour } from "src/domain/chart/entity/chart-of-hour.entity";
import { ChartOfMonth } from "src/domain/chart/entity/chart-of-month.entity";
import { ChartOfWeek } from "src/domain/chart/entity/chart-of-week.entity";

@Injectable()
export class MusicSchedulerUtil {
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

  async saveChartEntityByViewsEntity(viewsEntity: BaseViewsEntity, index: number) {
    const repositoryMap: RepositoryMap = {
      ViewsOfDay: this.chartOfDayRepository,
      ViewsOfHour: this.chartOfHourRepository,
      ViewsOfMonth: this.chartOfMonthRepository,
      ViewsOfWeek: this.chartOfWeekRepository,
      ViewsOfYear: this.chartOfYearRepository
    };

    const repository = repositoryMap[viewsEntity.constructor.name];

    console.log(viewsEntity.constructor);
    console.log(repositoryMap);
    console.log(repository);

    const chart =
      (await repository.findOneBy({ music: viewsEntity.music })) ??
      (await repository.save({
        music: viewsEntity.music,
        views: viewsEntity.views,
        ranking: index + 1,
        rise: 0,
        createdAt: Date()
      }));

    await repository.update(
      {
        id: chart.id
      },
      {
        views: chart.views,
        ranking: index + 1,
        rise: chart.ranking - (index + 1)
      }
    );
  }
}

type RepositoryMap = {
  ViewsOfDay: Repository<ChartOfDay>;
  ViewsOfHour: Repository<ChartOfHour>;
  ViewsOfMonth: Repository<ChartOfMonth>;
  ViewsOfWeek: Repository<ChartOfWeek>;
  ViewsOfYear: Repository<ChartOfYear>;
};
