import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { Music } from "../entity/music.entity";
import { Repository } from "typeorm";
import { ViewsOfHour } from "../entity/views-of-hour.entity";
import { ChartOfHour } from "src/domain/chart/entity/chart-of-hour.entity";
import { ViewsOfDay } from "../entity/views-of-day.entity";
import { ChartOfDay } from "src/domain/chart/entity/chart-of-day.entity";
import { ViewsOfMonth } from "../entity/views-of-month.entity";
import { ChartOfMonth } from "src/domain/chart/entity/chart-of-month.entity";
import { ViewsOfWeek } from "../entity/views-of-week.entity";
import { ChartOfWeek } from "src/domain/chart/entity/chart-of-week.entity";
import { ViewsOfYear } from "../entity/views-of-year.entity";
import { ChartOfYear } from "src/domain/chart/entity/chart-of-year.entity";

@Injectable()
export class MusicInfoScheduler {
  constructor(
    private readonly youtubeUtils: YoutubeUtils,
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfHour)
    private readonly viewsOfHourRepository: Repository<ViewsOfHour>,
    @InjectRepository(ChartOfHour)
    private readonly chartOfHourRepository: Repository<ChartOfHour>,
    @InjectRepository(ViewsOfDay)
    private readonly viewsOfDayRepository: Repository<ViewsOfDay>,
    @InjectRepository(ChartOfDay)
    private readonly chartOfDayRepository: Repository<ChartOfDay>,
    @InjectRepository(ViewsOfMonth)
    private readonly viewsOfMonthRepository: Repository<ViewsOfMonth>,
    @InjectRepository(ChartOfMonth)
    private readonly chartOfMonthRepository: Repository<ChartOfMonth>,
    @InjectRepository(ViewsOfWeek)
    private readonly viewsOfWeekRepository: Repository<ViewsOfWeek>,
    @InjectRepository(ChartOfWeek)
    private readonly chartOfWeekRepository: Repository<ChartOfWeek>,
    @InjectRepository(ViewsOfYear)
    private readonly viewsOfYearRepository: Repository<ViewsOfYear>,
    @InjectRepository(ChartOfYear)
    private readonly chartOfYearRepository: Repository<ChartOfYear>
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async getMusicInfoEachHour() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfHourList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);
        return await this.viewsOfHourRepository.save({
          views: musicInfo.viewCount,
          music: music,
          createdAt: Date()
        });
      })
    );
    viewsOfHourList.sort((a: ViewsOfHour, b: ViewsOfHour) => b.views - a.views);

    viewsOfHourList.forEach(async (viewsOfHour, index) => {
      const chartOfHour =
        (await this.chartOfHourRepository.findOneBy({ music: viewsOfHour.music })) ??
        (await this.chartOfHourRepository.save({
          music: viewsOfHour.music,
          views: viewsOfHour.views,
          ranking: index + 1,
          rise: 0,
          createdAt: Date()
        }));

      this.chartOfHourRepository.update(
        {
          id: chartOfHour.id
        },
        {
          views: viewsOfHour.views,
          ranking: index + 1,
          rise: chartOfHour.ranking - (index + 1)
        }
      );
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async getMusicInfoEachDay() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfDayList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);
        return await this.viewsOfDayRepository.save({
          views: musicInfo.viewCount,
          music: music,
          createdAt: Date()
        });
      })
    );
    viewsOfDayList.sort((a: ViewsOfDay, b: ViewsOfDay) => b.views - a.views);

    viewsOfDayList.forEach(async (viewsOfDay, index) => {
      const chartOfDay =
        (await this.chartOfDayRepository.findOneBy({ music: viewsOfDay.music })) ??
        (await this.chartOfDayRepository.save({
          music: viewsOfDay.music,
          views: viewsOfDay.views,
          ranking: index + 1,
          rise: 0,
          createdAt: Date()
        }));

      this.chartOfDayRepository.update(
        {
          id: chartOfDay.id
        },
        {
          views: viewsOfDay.views,
          ranking: index + 1,
          rise: chartOfDay.ranking - (index + 1)
        }
      );
    });
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async getMusicInfoEachMonth() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfMonthList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);
        return await this.viewsOfMonthRepository.save({
          views: musicInfo.viewCount,
          music: music,
          createdAt: Date()
        });
      })
    );
    viewsOfMonthList.sort((a: ViewsOfMonth, b: ViewsOfMonth) => b.views - a.views);

    viewsOfMonthList.forEach(async (viewsOfMonth, index) => {
      const chartOfMonth =
        (await this.chartOfMonthRepository.findOneBy({ music: viewsOfMonth.music })) ??
        (await this.chartOfMonthRepository.save({
          music: viewsOfMonth.music,
          views: viewsOfMonth.views,
          ranking: index + 1,
          rise: 0,
          createdAt: Date()
        }));

      this.chartOfMonthRepository.update(
        {
          id: chartOfMonth.id
        },
        {
          views: viewsOfMonth.views,
          ranking: index + 1,
          rise: chartOfMonth.ranking - (index + 1)
        }
      );
    });
  }

  @Cron(CronExpression.EVERY_WEEK)
  async getMusicInfoEachWeek() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfWeekList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);
        return await this.viewsOfWeekRepository.save({
          views: musicInfo.viewCount,
          music: music,
          createdAt: Date()
        });
      })
    );
    viewsOfWeekList.sort((a: ViewsOfWeek, b: ViewsOfWeek) => b.views - a.views);

    viewsOfWeekList.forEach(async (viewsOfWeek, index) => {
      const chartOfWeek =
        (await this.chartOfWeekRepository.findOneBy({ music: viewsOfWeek.music })) ??
        (await this.chartOfWeekRepository.save({
          music: viewsOfWeek.music,
          views: viewsOfWeek.views,
          ranking: index + 1,
          rise: 0,
          createdAt: Date()
        }));

      this.chartOfWeekRepository.update(
        {
          id: chartOfWeek.id
        },
        {
          views: chartOfWeek.views,
          ranking: index + 1,
          rise: chartOfWeek.ranking - (index + 1)
        }
      );
    });
  }

  @Cron("0 0 1 1 *")
  async getMusicInfoEachYear() {
    const musicList = await this.musicRepository.find();

    const musicIdList = musicList.map((music) => {
      return music.id;
    });

    const musicInfoList = await this.youtubeUtils.getVideoInfos(musicIdList);

    const viewsOfYearList = await Promise.all(
      musicInfoList.map(async (musicInfo) => {
        const musicId = musicInfo.videoId;
        const music = musicList.find((music) => music.id === musicId);
        return await this.viewsOfYearRepository.save({
          views: musicInfo.viewCount,
          music: music,
          createdAt: Date()
        });
      })
    );
    viewsOfYearList.sort((a: ViewsOfYear, b: ViewsOfYear) => b.views - a.views);

    viewsOfYearList.forEach(async (viewsOfYear, index) => {
      const chartOfYear =
        (await this.chartOfYearRepository.findOneBy({ music: viewsOfYear.music })) ??
        (await this.chartOfYearRepository.save({
          music: viewsOfYear.music,
          views: viewsOfYear.views,
          ranking: index + 1,
          rise: 0,
          createdAt: Date()
        }));

      this.chartOfYearRepository.update(
        {
          id: chartOfYear.id
        },
        {
          views: chartOfYear.views,
          ranking: index + 1,
          rise: chartOfYear.ranking - (index + 1)
        }
      );
    });
  }
}
