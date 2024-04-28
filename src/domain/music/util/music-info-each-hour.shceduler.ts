import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Music } from "../entity/music.entity";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { ViewsOfHour } from "../entity/views-of-hour.entity";
import { ChartOfHour } from "src/domain/chart/entity/chart-of-hour.entity";

@Injectable()
export class MusicInfoEachHourScheduler {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfHour)
    private readonly viewsOfHourRepository: Repository<ViewsOfHour>,
    @InjectRepository(ChartOfHour)
    private readonly chartOfHourRepository: Repository<ChartOfHour>,
    private readonly youtubeUtils: YoutubeUtils
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
}
