import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Music } from "../entity/music.entity";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { ViewsOfDay } from "../entity/views-of-day.entity";
import { ChartOfDay } from "src/domain/chart/entity/chart-of-day.entity";

@Injectable()
export class MusicInfoEachDayScheduler {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfDay)
    private readonly viewsOfDayRepository: Repository<ViewsOfDay>,
    @InjectRepository(ChartOfDay)
    private readonly chartOfDayRepository: Repository<ChartOfDay>,
    private readonly youtubeUtils: YoutubeUtils
  ) {}

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
