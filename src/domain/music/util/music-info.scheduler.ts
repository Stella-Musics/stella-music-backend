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
    private readonly chartOfDayRepository: Repository<ChartOfDay>
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
}