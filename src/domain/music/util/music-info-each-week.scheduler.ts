import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { ViewsOfWeek } from "../entity/views-of-week.entity";
import { ChartOfWeek } from "src/domain/chart/entity/chart-of-week.entity";
import { Repository } from "typeorm";
import { YoutubeUtils } from "src/global/thridparty/youtube/youtube.util";
import { Music } from "../entity/music.entity";

export class MusicInfoEachWeekScheduler {
  constructor(
    private readonly youtubeUtils: YoutubeUtils,
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
    @InjectRepository(ViewsOfWeek)
    private readonly viewsOfWeekRepository: Repository<ViewsOfWeek>,
    @InjectRepository(ChartOfWeek)
    private readonly chartOfWeekRepository: Repository<ChartOfWeek>
  ) {}

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
}
